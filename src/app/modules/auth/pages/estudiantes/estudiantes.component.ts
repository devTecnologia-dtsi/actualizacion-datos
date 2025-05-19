import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AlertsService } from 'src/app/core/services/alerts.service';
import { UniminutoService } from 'src/app/core/services/uniminuto.service';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  templateUrl: './estudiantes.component.html',
  styleUrls: ['./estudiantes.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class EstudiantesComponent implements OnInit {
  form!: FormGroup;
  error: boolean = false;
  isLoading: boolean = false;
  today: string = new Date().toISOString().split('T')[0];

  // Ejemplos predefinidos
  ejemplos = {
    valido: {
      email: 'carlos.martinez2021@uniminuto.edu.co',
      expedicion: '2019-05-20'
    },
    emailInvalido: {
      email: 'usuario@gmail.com',
      expedicion: '2020-03-15'
    },
    fechaInvalida: {
      email: 'ana.torres456@uniminuto.edu.co',
      expedicion: '2025-12-31'
    }
  };

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
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/@uniminuto\.edu(\.co)?$/i)
      ]],
      expedicion: ['', [
        Validators.required,
        Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
        this.validateIssueDate.bind(this)
      ]]
    });
  }

  validateIssueDate(control: any): { [key: string]: boolean } | null {
    if (!control.value) return null;
    
    const issueDate = new Date(control.value);
    const today = new Date();
    
    if (issueDate > today) {
      return { 'futureDate': true };
    }
    
    return null;
  }

  get errorEmail() {
    const errors = this.form.get('email')?.errors;
    if (errors?.['required']) {
      return 'El correo institucional es obligatorio';
    } else if (errors?.['email'] || errors?.['pattern']) {
      return 'Debe ser un correo @uniminuto.edu.co válido';
    }
    return '';
  }

  get errorExpedicion() {
    const errors = this.form.get('expedicion')?.errors;
    if (errors?.['required']) {
      return 'La fecha de expedición es requerida';
    } else if (errors?.['pattern']) {
      return 'Formato de fecha inválido (AAAA-MM-DD)';
    } else if (errors?.['futureDate']) {
      return 'La fecha no puede ser futura';
    }
    return '';
  }

  validacion(campo: string): boolean {
    return !!(
      this.form.get(campo)?.invalid &&
      (this.form.get(campo)?.dirty || this.form.get(campo)?.touched)
    );
  }

  cargarEjemplo(tipo: 'valido' | 'emailInvalido' | 'fechaInvalida') {
    this.form.patchValue(this.ejemplos[tipo]);
    this.form.markAllAsTouched();
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.error = false;

    const { email, expedicion } = this.form.value;

    console.log('=== DATOS ENVIADOS ===');
    console.log('Correo electrónico:', email);
    console.log('Fecha de expedición:', expedicion);

    try {
      const documento = this.extraerDocumento(email);
      const fExp = this.formatIssueDate(expedicion);

      console.log('Documento extraído:', documento);
      console.log('Fecha formateada:', fExp);

      setTimeout(() => {
        this.isLoading = false;
        
        const respuestaSimulada = {
          Cn: '12345',
          FirstName: 'Carlos',
          LastName: 'Martínez',
          Status: 'Active'
        };

        console.log('Respuesta simulada:', respuestaSimulada);
        
        sessionStorage.setItem('usuarioValidado', JSON.stringify(respuestaSimulada));
        this._router.navigate(['/auth/preguntas'], { state: respuestaSimulada });
      }, 1500);

    } catch (error) {
      this.isLoading = false;
      console.error('Error:', error);
      this._alertas.errorLogin('Ocurrió un error al procesar tu solicitud.');
    }
  }

  private extraerDocumento(email: string): string {
    const username = email.split('@')[0];
    const numeros = username.replace(/\D/g, '');
    return numeros || '0';
  }

  private formatIssueDate(date: string): string {
    const parts = date.split('-');
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
}