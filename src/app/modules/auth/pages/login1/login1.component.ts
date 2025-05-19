import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AlertsService } from 'src/app/core/services/alerts.service';
import { UniminutoService } from 'src/app/core/services/uniminuto.service';

@Component({
  standalone: true,
  selector: 'app-login1',
  templateUrl: './login1.component.html',
  styleUrls: ['./login1.component.css'],
  imports: [
    CommonModule,         
    ReactiveFormsModule,  
    RouterModule          
  ], 
  providers: [  
    AlertsService,
    UniminutoService
  ]
})
export class Login1Component implements OnInit {
  form!: FormGroup;
  tipo!: boolean;
  error: boolean = false;
  isLoading: boolean = false;


  private docLengths: { [key: string]: { min: number, max: number } } = {
    'CC': { min: 8, max: 10 },   
    'CE': { min: 6, max: 12 },   
    'TI': { min: 8, max: 10 },   
    'PS': { min: 6, max: 12 },   
    'CA': { min: 6, max: 12 },   
    'CR': { min: 6, max: 12 },   
    'PC': { min: 6, max: 12 },   
    'PE': { min: 6, max: 12 },                                 
    'PT': { min: 6, max: 12 }    
  };

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly _uniminuto: UniminutoService,
    private readonly _alertas: AlertsService
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      documento: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]*$/),
        this.validateDocumentLength.bind(this)
      ]],
      tipoDoc: ['CC', [Validators.required]],
      cookies: [false, [Validators.requiredTrue]],
    });

    this.form.get('tipoDoc')?.valueChanges.subscribe(() => {
      this.updateDocumentValidation();
    });
  }

  private validateDocumentLength(control: any): { [key: string]: any } | null {
    const tipoDoc = this.form?.get('tipoDoc')?.value;
    const value = control.value;
    
    if (!tipoDoc || !value) return null;
    
    const lengths = this.docLengths[tipoDoc] || { min: 6, max: 12 };
    
    if (value.length < lengths.min) {
      return { minlength: { requiredLength: lengths.min } };
    }
    
    if (value.length > lengths.max) {
      return { maxlength: { requiredLength: lengths.max } };
    }
    
    return null;
  }

  private updateDocumentValidation(): void {
    const docControl = this.form.get('documento');
    docControl?.updateValueAndValidity();
  }

  get errorDocumento(): string {
    const errors = this.form.get('documento')?.errors;
    const tipoDoc = this.form.get('tipoDoc')?.value;
    const lengths = tipoDoc ? this.docLengths[tipoDoc] : { min: 6, max: 12 };

    if (errors?.['required']) {
      return "El documento es obligatorio.";
    } else if (errors?.['pattern']) {
      return "El documento solo puede contener números.";
    } else if (errors?.['minlength']) {
      return `El documento debe tener al menos ${lengths.min} dígitos.`;
    } else if (errors?.['maxlength']) {
      return `El documento no puede tener más de ${lengths.max} dígitos.`;
    }
    return "";
  }

  validacion(campo: string): boolean {
    const control = this.form.get(campo);
    return control ? control.invalid && control.touched : false;
  }

  get errortipoDoc(): string {
    const errors = this.form.get('tipoDoc')?.errors;
    if (errors?.["required"]) {
      return "Selecciona un tipo de documento.";
    }
    return "";
  }

  get errorCookies(): string {
    const errors = this.form.get('cookies')?.errors;
    if (errors?.["required"]) {
      return "Debes aceptar la política.";
    }
    return "";
  }

  isContinueEnabled(): boolean {
    return this.form.valid && this.form.get('cookies')?.value;
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  
    this.isLoading = true;
    const { documento, tipoDoc } = this.form.value;
  

    const esEstudiante = this.esDocumentoDeEstudiante(documento);
    
    setTimeout(() => {
      this.isLoading = false;
      
      if (esEstudiante) {
        this._router.navigate(['/auth/estudiantes'], {
          state: { documento, tipoDoc }
        });
      } else {
        this._router.navigate(['/auth/egresados'], {
          state: { documento, tipoDoc }
        });
      }
    }, 1500);
  }
  
  private esDocumentoDeEstudiante(documento: string): boolean {

    // Ejemplo simple:
    return documento.length === 8; // Solo como ejemplo
  }
}