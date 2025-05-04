import { Component, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Departamentos, Paises, DireccionModal, Municipios, Personales } from 'src/app/core/interfaces/uniminuto.interface';
import { AlertsService } from 'src/app/core/services/alerts.service';
import { UniminutoService } from 'src/app/core/services/uniminuto.service';
import { direccionValidator } from '../validators/direccion-validator';
import { paisValidoValidator } from '../validators/pais-validator';
import { noContieneEnie } from '../validators/barrio-validator';
import { debounceTime, distinctUntilChanged, filter, lastValueFrom, of, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-formulario-tabla',
  templateUrl: './formulario-tabla.component.html',
  styleUrls: ['./formulario-tabla.component.css']
})
export class FormularioTablaComponent {
  // Declaración de variables
  myForm!: FormGroup;
  @Input() idBanner = '';
  @Input() correoAca = '';
  @Input() datosPersonales: Personales = {} as Personales;

  pais: Paises = {} as Paises;                            // Objeto para almacenar el país seleccionado    
  paises: Paises[] = [];                                  // Lista de países
  paisesFiltrados: Paises[] = [];                         // Lista de países filtrados
  private paisSubscription?: Subscription;                // Suscripción para el país

  departamento: Departamentos = {} as Departamentos;      // Objeto para almacenar el departamento seleccionado
  departamentos: Departamentos[] = [];                    // Lista de departamentos
  deptosFiltrados: Departamentos[] = [];                  // Lista de departamentos filtrados
  private departamentoSubscription?: Subscription;        // Suscripción para el departamento

  municipio: Municipios = {} as Municipios;               // Objeto para almacenar el municipio seleccionado
  municipios: Municipios[] = [];                          // Lista de municipios
  municipiosFiltrados = this.municipios;                  // Lista de municipios filtrados
  private municipioSubscription?: Subscription;           // Suscripción para el municipio

  tipoDirOp = [
    { label: 'RU', value: 'Residencia Rural' },
    { label: 'RE', value: 'Residencia Urbana' }
  ];
  direccion: string = '';
  showModal: boolean = false;                           // Variable para controlar la visibilidad del modal
  actualizando: boolean = false;                        // Variable para controlar el estado de actualización


  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _umd: UniminutoService,
    private readonly _alertas: AlertsService
  ) {
    this.myForm = this._formBuilder.group({
      telefono: ['', [Validators.maxLength(12), Validators.pattern(/^[0-9]*$/)]],
      celular: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(16), Validators.pattern(/^[0-9]*$/),]],
      correo: ['', [Validators.required, Validators.email]],
      tipoDireccion: ['', [Validators.required]],
      direccion: ['', [Validators.required, /*direccionValidator()*/]],
      barrio: ['', [Validators.required, noContieneEnie, Validators.pattern(/^[a-zA-Z0-9\s]+$/)]],
      pais: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      municipio: ['', [Validators.required]],
      telefonoCode: ['', [Validators.maxLength(4), Validators.pattern(/^[0-9]*$/),]],
      celularCode: ['', [Validators.maxLength(4), Validators.pattern(/^[0-9]*$/),]]
    });
  }
  ngOnInit() {

    this._umd.getDemografia("Paises", "", "").subscribe({
      next: (paises: Paises[]) => {
        this.paises = paises;
        const paisControl = this.myForm.get('pais');
        paisControl?.setValidators([
          Validators.required,
          paisValidoValidator(this.paises)
        ]);
        paisControl?.updateValueAndValidity();
        this.PaisFilter();
        this._alertas.errorCorreo("Dispones de 20 minutos para actualizar tus datos. Ten en cuenta que algunos campos habilitarán opciones de selección, cuando escribes.", "info", "Gracias por actualizar tus datos");
      },
      error: () => {
        console.log("Error al cargar los países");
      }
    });
    this.marcarCamposComoTocados(); // Marcar todos los campos como tocados al inicio para mostrar errores de validación.
  }
  ngOnDestroy() {
    this.paisSubscription?.unsubscribe();
    this.departamentoSubscription?.unsubscribe();
    this.municipioSubscription?.unsubscribe();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datosPersonales'] && this.datosPersonales) {
      this.llenarFormulario();
    }
  }

  private obtenerPrefijoPais(idPais: string): void { // Método para obtener el prefijo del país seleccionado
    this._umd.getPrefijo(idPais).subscribe({
      next: (res: any) => {

        if (res.prefijo) {
          this.pais.prefijo_banner = res.prefijo;
          this.myForm.patchValue({
            telefonoCode: res.prefijo,
            celularCode: res.prefijo
          });
        }
      },
      error: (err) => {
        console.error("Error obteniendo el prefijo del país", err);
      }
    })
  }

  private PaisFilter(): void {  //Metodo que se ejecuta al inicio
    this.paisSubscription?.unsubscribe();
    this.paisSubscription = this.myForm.get('pais')?.valueChanges
      .pipe(
        debounceTime(300),        // Evitar filtrados con cada tecla
        distinctUntilChanged()    //Solo filtra si el valor cambió
      )
      .subscribe(valor => {
        if (typeof valor === 'string') {
          const valorLower = valor.toLowerCase();
          this.paisesFiltrados = this.paises.filter(p =>
            p.nombre?.toLowerCase().includes(valorLower)
          );
        } else {
          this.paisesFiltrados = [];
        }
      });
  }
  seleccionarPais(prefijo: string, prefijo_banner: string, pais: string): void {  // Método para seleccionar el país en el formulario
    this.pais.prefijo = prefijo;
    this.pais.nombre = pais;
    this.pais.prefijo_banner = prefijo_banner;

    this.municipio = {} as Municipios;
    this.departamento = {} as Departamentos;

    this.myForm.patchValue({
      pais: pais,
      departamento: null,
      municipio: null,
      telefonoCode: prefijo,
      celularCode: prefijo
    }, { emitEvent: false });

    this.departamentos = [];
    this.municipios = [];
    const paisObj = this.paises.find(p => p.nombre === pais);
    if (paisObj) {
      this.loadDepartamentos(paisObj.nombre);
    }
    this.paisesFiltrados = [];
  }
  loadDepartamentos(paisId: string): void {             // Método para cargar los departamentos según el país seleccionado

    this._umd.getDemografia("Departamento", paisId, "").subscribe({
      next: (deptos) => {
        this.departamentos = deptos;
        this.municipios = []; // Limpiar municipios al cambiar departamento
      },
      error: (err) => console.error("Error cargando departamentos", err)
    });
    this.DepartamentoFilter();
  }
  private DepartamentoFilter(): void {                  // Método para filtrar los departamentos
    this.departamentoSubscription?.unsubscribe();
    this.departamentoSubscription = this.myForm.get('departamento')?.valueChanges
      .pipe(
        debounceTime(300),        // Evitar filtrados con cada tecla
        distinctUntilChanged()    //Solo filtra si el valor cambió
      )
      .subscribe(valor => {
        if (typeof valor === 'string') {
          const valorLower = valor.toLowerCase();
          this.deptosFiltrados = this.departamentos.filter(d =>
            d.nombre?.toLowerCase().includes(valorLower)
          );
        } else {
          this.deptosFiltrados = [];
        }
      });
  }
  seleccionarDepartamento(prefijo: string, depto: string): void { // Método para seleccionar el departamento en el formulario
    this.departamento.banner_id = prefijo;
    this.departamento.nombre = depto;

    this.municipio = {} as Municipios;

    this.myForm.patchValue({
      municipio: null,
      departamento: depto,
    }, { emitEvent: false });

    this.municipios = [];
    const depObj = this.departamentos.find(d => d.nombre === depto);
    if (depObj) {
      this.loadMunicipios(depObj.nombre!);
    }
    this.deptosFiltrados = [];
  }
  loadMunicipios(departamento: string): void {                    // Método para cargar los municipios según el departamento seleccionado 
    this._umd.getDemografia("Municipio", "", departamento).subscribe({
      next: (municipios) => {
        this.municipios = municipios;
      },
      error: (err) => console.error("Error cargando municipios", err)
    });
    this.municipiosFilter();
  }
  private municipiosFilter(): void {                              // Método para filtrar los municipios
    this.municipioSubscription?.unsubscribe();
    this.municipioSubscription = this.myForm.get('municipio')?.valueChanges
      .pipe(
        debounceTime(300),        // Evitar filtrados con cada tecla
        distinctUntilChanged()    //Solo filtra si el valor cambió
      )
      .subscribe(valor => {
        if (typeof valor === 'string') {
          const valorLower = valor.toLowerCase();
          this.municipiosFiltrados = this.municipios.filter(m =>
            m.nombre?.toLowerCase().includes(valorLower)
          );
        } else {
          this.municipiosFiltrados = [];
        }
      });

  }
  seleccionarMunicipio(prefijo: string, municipio: string): void {          // Método para seleccionar el municipio en el formulario
    this.municipio.banner_id = prefijo;
    this.municipio.nombre = municipio;
    this.myForm.patchValue({
      municipio: municipio,
    }, { emitEvent: false });
    this.municipiosFiltrados = [];
  }
  llenarFormulario() {

    // Método para llenar el formulario con los datos del usuario
    this.pais.nombre = this.datosPersonales.PAIS;
    this.pais.id = this.datosPersonales.PAISID;
    this.departamento.nombre = this.datosPersonales.DEPARTAMENTO;
    this.departamento.banner_id = this.datosPersonales.DEPARTAMENTOID;
    this.municipio.nombre = this.datosPersonales.MUNICIPIO;
    this.municipio.banner_id = this.datosPersonales.MUNICIPIOID;

    this.obtenerPrefijoPais(this.datosPersonales.PAISID); // Obtener y llenar el formulario con el prefijo del país seleccionado

    this.myForm.patchValue({
      telefono: this.datosPersonales.TELEFONORESIDENCIA,
      celular: this.datosPersonales.TELEFONOMOVIL,
      correo: this.datosPersonales.EMAIL,
      tipoDireccion: this.datosPersonales.TIPODIRECCION,
      direccion: this.datosPersonales.DIRECCIONRESIDENCIA,
      barrio: this.datosPersonales.BARRIORESIDENCIA,
      pais: this.datosPersonales.PAIS,
      departamento: this.datosPersonales.DEPARTAMENTO,
      municipio: this.datosPersonales.MUNICIPIO
    }, { emitEvent: false });

    // Volver a configurar el filtro después de actualizar los valores
    this.PaisFilter();

  }
  recibirDireccion(direccionModal: DireccionModal) {        // Método para recibir la dirección desde el modal
    // this.direccionModal = direccionModal; // Se almacena el objeto en la variable global
    this.direccion = direccionModal.via + ' ' + direccionModal.seccionUno + ' # ' +
      direccionModal.seccionDos + ' - ' + direccionModal.seccionTres + ' ' +
      direccionModal.seccionCuatro + ' ' + direccionModal.seccionCinco + ' ' +
      direccionModal.seccionSeis + ' ' + direccionModal.seccionSiete;

    this.myForm.patchValue({
      direccion: this.direccion // o '' si deseas establecerla como una cadena vacía
    });
  }

  get formulario() {
    return this.myForm.controls;
  }
  get errorTel() {
    const errors = this.myForm.get('telefono')?.errors;
    // console.log(errors);
    if (errors?.["required"]) {
      return "El campo no puede estar vacío.";
    } else if (errors?.["minlength"]) {
      return "El campo debe ser de al menos 10 caracteres"
    } else if (errors?.["pattern"]) {
      return "Solo se permiten caracteres numéricos."
    }
    return ""
  }
  get errorCelular() {
    const errors = this.myForm.get('celular')?.errors;
    // console.log(errors);
    if (errors?.["required"]) {
      return "El campo no puede estar vacío.";
    } else if (errors?.["minlength"]) {
      return "El campo debe ser de al menos 10 caracteres"
    } else if (errors?.["pattern"]) {
      return "Solo se permiten caracteres numéricos."
    }
    return ""
  }
  get errorCorreo() {
    const errors = this.myForm.get('correo')?.errors;
    // console.info(errors);
    if (errors?.["required"]) {
      return "El campo no puede estar vacío.";
    } else if (errors?.["email"]) {
      return "El correo no es válido.";
    }
    return ""
  }
  get errorDireccion() {
    const errors = this.myForm.get('direccion')?.errors;
    if (errors?.["required"]) {
      return "El campo no puede estar vacío.";
    } else if (errors?.["direccionInvalida"]) {
      return "La dirección tiene un formato que no es válido."
    }
    return ""
  }
  get errortipoDireccion() {
    const errors = this.myForm.get('tipoDireccion')?.errors;
    if (errors?.["required"]) {
      return "El campo no puede estar vacío.";
    } else if (errors?.["tipoDireccion"]) {
      return "El Formato no es válido."
    }
    return ""
  }
  get errorBarrio() {
    const errors = this.myForm.get('barrio')?.errors;
    // console.log(errors);
    if (errors?.["required"]) {
      return "El campo no puede estar vacío.";
    } else if (errors?.["contieneEnie"]) {
      return "El caracter 'ñ' no está permitido. (Puede cambiarse por 'n')";
    } else if (errors?.["pattern"]) {
      return "Los caracteres especiales no están permitidos.";
    }

    return ""
  }
  get errorPais() {
    const errors = this.myForm.get('pais')?.errors;
    if (errors?.["required"]) {
      return "El campo no puede estar vacío.";
    } else if (errors?.["paisInvalido"]) {
      // console.log(errors);
      
      return "Mientras escribes, elije un pais de la lista de sugerencias.";
    }
    return ""
  }
  get errorDepartamento() {
    const errors = this.myForm.get('departamento')?.errors;
    if (errors?.["required"]) {
      return "El campo no puede estar vacío.";
    }
    return ""
  }
  get errorMunicipio() {
    const errors = this.myForm.get('municipio')?.errors;
    if (errors?.["required"]) {
      return "El campo no puede estar vacío.";
    }
    return ""
  }
  validacion(campo: string) {
    return this.myForm.get(campo)?.invalid
      && this.myForm.get(campo)?.touched;
  }
  formularioValido(formulario: FormGroup): string | boolean {
    for (const campo in formulario.controls) {
      if (formulario.controls[campo].errors) {
        return campo;
      }
    }
    return true;
  }
  marcarCamposComoTocados() {
    Object.values(this.myForm.controls).forEach(control => {
      control.markAsTouched();
    })
  }
  enviarDatos() {
    const validaDatos = this.formularioValido(this.myForm);

    if (validaDatos !== true) {
      this._alertas.errorCorreo("Por favor verifique el campo " + validaDatos, "warning", "Error en el formulario");
      this.marcarCamposComoTocados();
      return;

    }

    if (this.departamento.banner_id === undefined || this.departamento.banner_id === '1') {
      this.departamento.banner_id = 'FR';
    }
    if (this.municipio.banner_id === undefined) {
      this.municipio.banner_id = '0';
    }
    this.actualizando = true; // Cambia el estado a actualizando
    const datos = {
      correo: this.myForm.get('correo')?.value,
      documento: this.datosPersonales.NUMEROIDENTIFICACION,
      celularCode: this.myForm.get('celularCode')?.value,
      celular: this.myForm.get('celular')?.value,
      telefonoCode: this.myForm.get('telefonoCode')?.value,
      telefono: this.myForm.get('telefono')?.value,
      tipoDireccion: this.myForm.get('tipoDireccion')?.value,
      departamento: this.departamento.banner_id,
      barrio: this.myForm.get('barrio')?.value,
      municipio: this.municipio.banner_id,
      pais: this.pais.prefijo_banner,
      direccion: this.myForm.get('direccion')?.value
    };
    if (datos.telefono === undefined || datos.telefono === null || datos.telefono === '') {
      datos.telefono = 'No aplica';
    }
    this._umd.actualizarDatos(this.idBanner, datos).subscribe({
      next: (res) => {
        if (res) {
          this.actualizando = false;
          this._alertas.errorCorreo("Tus datos han sido actualizados correctamente", "success", "Actualización exitosa");
        } else {
          this.actualizando = false;
          this._alertas.errorCorreo("Error al actualizar los datos", "error", "Error en la actualización");
        }
      },
      error: (err) => {
        this.actualizando = false;
        console.error("Error al actualizar los datos", err);
        this._alertas.errorCorreo("Error al actualizar los datos", "error", "Por favor comunicate con soporte a través de https://soporte.uniminuto.edu/ o vuelve a iniciar sesión.");
      }
    });
    // window.location.reload();

  }
  actualizarFoto() {
    window.open("https://fotografias.uniminuto.edu/uploads/" + this.idBanner + '?correo=' + this.correoAca, '_blank');
  }

}
