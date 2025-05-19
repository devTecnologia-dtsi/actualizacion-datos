import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertsService } from 'src/app/core/services/alerts.service';
import { UniminutoService } from 'src/app/core/services/uniminuto.service';

@Component({
  standalone: true,
  selector: 'app-egresados',
  templateUrl: './egresados.component.html',
  styleUrls: ['./egresados.component.css'],
  imports: [
    CommonModule,         
    ReactiveFormsModule, 
    RouterModule          
  ]
})
export class EgresadosComponent implements OnInit {
  form!: FormGroup;
  tipo: boolean = false;
  error: boolean = false;
  isLoading: boolean = false;
  today: string = new Date().toISOString().split('T')[0];

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly _uniminuto: UniminutoService,
    private readonly _alertas: AlertsService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = this._formBuilder.group({
      documento: ['1019059352', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^[0-9]*$/),
      ]],
      nacimiento: ['1991-04-06', [
        Validators.required, 
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
        this.validateBirthDate.bind(this)
      ]],
      expedicion: ['2009-04-20', [
        Validators.required, 
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
        this.validateIssueDate.bind(this)
      ]],
      politica: [true, [Validators.requiredTrue]],
    });
  }

  validateBirthDate(control: any): { [key: string]: boolean } | null {
    if (!control.value) return null;
    
    const birthDate = new Date(control.value);
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 100); 
    
    if (birthDate > today) {
      return { 'futureDate': true };
    }
    
    if (birthDate < minDate) {
      return { 'tooOld': true };
    }
    
    return null;
  }

  validateIssueDate(control: any): { [key: string]: boolean } | null {
    if (!control.value || !this.form) return null;
    
    const issueDate = new Date(control.value);
    const today = new Date();
    const birthDateControl = this.form.get('nacimiento');
    
    if (issueDate > today) {
      return { 'futureDate': true };
    }
    
    if (birthDateControl?.value) {
      const birthDate = new Date(birthDateControl.value);
      if (issueDate < birthDate) {
        return { 'beforeBirth': true };
      }
    }
    
    return null;
  }

  get formulario() {
    return this.form.controls;
  }

  get errorDocumento() {
    const errors = this.form.get('documento')?.errors;
    if (errors?.['required']) {
      return 'El documento es obligatorio.';
    } else if (errors?.['minlength']) {
      return 'El documento es demasiado corto.';
    } else if (errors?.['pattern']) {
      return 'El documento solo puede contener números.';
    }
    return '';
  }

  get errorNacimiento() {
    const errors = this.form.get('nacimiento')?.errors;
    if (errors?.['required']) {
      return 'Este campo es obligatorio.';
    } else if (errors?.['pattern']) {
      return 'Por favor incluya una fecha válida (YYYY-MM-DD).';
    } else if (errors?.['futureDate']) {
      return 'La fecha de nacimiento no puede ser en el futuro.';
    } else if (errors?.['tooOld']) {
      return 'La fecha de nacimiento no es válida.';
    }
    return '';
  }

  get errorExpedicion() {
    const errors = this.form.get('expedicion')?.errors;
    if (errors?.['required']) {
      return 'Este campo es obligatorio.';
    } else if (errors?.['pattern']) {
      return 'Por favor incluya una fecha válida (YYYY-MM-DD).';
    } else if (errors?.['futureDate']) {
      return 'La fecha de expedición no puede ser en el futuro.';
    } else if (errors?.['beforeBirth']) {
      return 'La fecha de expedición no puede ser anterior a la de nacimiento.';
    }
    return '';
  }

  get errorPolitica() {
    const errors = this.form.get('politica')?.errors;
    if (errors?.['required']) {
      return 'Debes aceptar la política.';
    }
    return '';
  }

  validacion(campo: string): boolean {
    return !!(
      this.form.get(campo)?.invalid &&
      (this.form.get(campo)?.dirty || this.form.get(campo)?.touched)
    );
  }

  cambiarTipoInput(): void {
    this.tipo = !this.tipo;
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { documento, nacimiento, expedicion } = this.form.value;

    try {
      const fNac = this.formatBirthDate(nacimiento);
      const fExp = this.formatIssueDate(expedicion);

      this._uniminuto.login(documento, fNac, fExp).subscribe({
        next: (validacion) => {
          this.handleLoginResponse(validacion, documento);
        },
        error: (error) => {
          this.handleLoginError(error);
        }
      });
    } catch (error) {
      this.handleLoginError(error);
    }
  }

  private formatBirthDate(date: string): string {
    const parts = date.split('-');
    if (parts.length !== 3) throw new Error('Formato de fecha inválido');
    return parts[2] + parts[1] + parts[0]; 
  }

  private formatIssueDate(date: string): string {
    const parts = date.split('-');
    if (parts.length !== 3) throw new Error('Formato de fecha inválido');
    return parts[2] + '/' + parts[1] + '/' + parts[0]; 
  }

  private handleLoginResponse(validacion: any, documento: string): void {
    this.isLoading = false;
  
    if (validacion.Cn && validacion.Cn !== 'Null') {
      const nombres = validacion.FirstName || '';
      const apellidos = validacion.LastName || '';
      const sitio = "1";  
  
      this._uniminuto.estadisticas(documento, nombres, apellidos, sitio)
        .subscribe({
          next: () => console.log('Registro almacenado'),
          error: (e) => console.error('Error al almacenar estadísticas:', e)
        });

    sessionStorage.setItem('validacion', JSON.stringify(validacion));
  
      this._router.navigate(['/dashboard'], { state: { validacion } });
    } else {
      this._alertas.errorLogin('No hemos encontrado información relacionada. Si crees que esto es un error, por favor consulta con nuestro equipo de soporte a través del siguiente enlace: https://soporte.uniminuto.edu');
    }
  }
  

  private handleLoginError(error: any): void {
    this.isLoading = false;
    console.error('Error en el login:', error);
    this._alertas.errorLogin('Ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.');
  }
}
