import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { errorLogin, successLogin } from 'src/app/core/interfaces/login.interface';
import { AlertsService } from 'src/app/core/services/alerts.service';
import { LoginService } from 'src/app/core/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form!: FormGroup;
  tipo!: boolean;
  error: boolean = false;
  isLoading: boolean = false;

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _datePipe: DatePipe,
    private readonly _router: Router,
    private readonly _login: LoginService,
    private readonly _alertas: AlertsService
  ) { }
  ngOnInit(): void {
    this.form = this._formBuilder.group({
      documento: ['1019059352', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^[0-9]*$/),
      ]],
      nacimiento: ['1991-04-06', [Validators.required, Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$')]],
      expedicion: ['2009-04-20', [Validators.required, Validators.pattern('^\\d{4}-\\d{2}-\\d{2}$')]],
      politica: [true, [Validators.requiredTrue]],
      tipoDoc: ['CC', [Validators.required]],
    });
  }
  get errortipoDoc() {
    const errors = this.form.get('tipoDoc')?.errors;
    console.log(errors);
    if (errors?.["required"]) {
      return "Selecciona un tipo de documento.";
    }
    return ""
  }
  get formulario() {
    return this.form.controls;
  }
  get errorDocumento() {
    const errors = this.form.get('documento')?.errors;
    if (errors?.["required"]) {
      return "El documento es obligatorio."
    }
    else if (errors?.["minlength"]) {
      return "El documento es demasiado corto."
    }
    else if (errors?.["pattern"]) {
      return "El documento solo puede contener números."
    }
    return ""
  }
  get errorNacimiento() {
    const errors = this.form.get('nacimiento')?.errors;
    if (errors?.["required"]) {
      return "Este campo es obligatorio.";
    } else if (errors?.["pattern"]) {
      return "Por favor incluya una fecha válida.";
    }
    return ""
  }
  get errorExpedicion() {
    const errors = this.form.get('expedicion')?.errors;
    if (errors?.["required"]) {
      return "Este campo es obligatorio.";
    } else if (errors?.["pattern"]) {
      return "Por favor incluya una fecha válida.";
    }
    return ""
  }
  get errorPolitica() {
    const errors = this.form.get('politica')?.errors;
    if (errors?.["required"]) {
      return "Debes aceptar la política.";
    }
    return ""
  }
  validacion(campo: string) {
    return this.form.get(campo)?.invalid
      && this.form.get(campo)?.touched;
  }
  cambiarTipoInput() {
    this.tipo = !this.tipo;
  }
  onSubmit() {
    this.isLoading = true;
    let { nacimiento, expedicion } = this.form.value;
    const { documento, politica, tipoDoc } = this.form.value;
    nacimiento = this.transformarFecha(nacimiento);
    expedicion = this.transformarFecha(expedicion);
    // // Si form invalido, entonces no se ejecuta el submit.
    if (this.form.invalid) {
      // console.log(this.form.controls);
      return;
    }
    // Verificar los datos del usuario
    this._login.login(documento, nacimiento, expedicion, politica, tipoDoc).subscribe({
      next: (validacion: successLogin | errorLogin) => {
        this.isLoading = false;
        if ('success' in validacion && validacion.success && validacion.jws) {
          sessionStorage.setItem('auth_token', String(validacion.jws));
          this._router.navigate(['/dashboard']); // Redirige al dashboard
        } else {
          this._alertas.errorLogin('Acceso Denegado' + 'No tienes permiso para acceder.');
        }
      },
      error: (err) => {
        if (err.error.error === 'El correo no coincide') {
          this._alertas.errorLogin('El documento no pertenece a un egresado.');
          this.form.setValue({ documento: '', nacimiento: '', expedicion: '', politica: true, tipoDoc: 'CC' });
        } else {
          this.isLoading = false;
          this._alertas.errorLogin(err.error.error || 'Ocurrió un error inesperado');
        }
      },
      complete: () => {
        this.isLoading = false;
        console.log('Observable completado');
      }
    });
  }
  transformarFecha(fecha: string): string | null {
    return this._datePipe.transform(fecha, 'dd/MM/yyyy');
  }
}
