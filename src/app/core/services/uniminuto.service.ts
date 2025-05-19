import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Academia, Estudiante, Login, MunicipioName, UsuarioDA, nombres, CorreoBanner } from '../interfaces/uniminuto.interface';
import { Registraduria } from '../interfaces/registraduria.interface';
import { environment } from 'src/environments/environment';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, ObservableInput, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UniminutoService {
  registrarAccesoEstudiante: any;
  loginEstudiante: any;
  handleError: (err: any, caught: Observable<Object>) => ObservableInput<any> = (err, caught) => throwError(err);
  apiUrl: any;
  updatePersonalData(formValues: { barrio: { value: any; }; celular: { value: any; }; correo: { value: any; }; departamento: { value: any; }; direccion: { value: any; }; municipio: { value: any; }; pais: { value: any; }; telefono: { value: any; }; tipoDireccion: { value: any; }; }) {
    throw new Error('Method not implemented.');
  }
  private _acceso: boolean = false;
  constructor(
    private _http: HttpClient
  ) { }
   llamarRespuestas(body: { cn: string }): Observable<any> {
    return this._http.post(`${this.apiUrl}/seguridad/respuestas`, body, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Método para enviar las respuestas puntuadas
   * @param respuestas Array con las respuestas y datos del usuario
   */
  puntuarRespuestas(respuestas: any[]): Observable<any> {
    return this._http.post(`${this.apiUrl}/seguridad/puntuar`, respuestas, this.headers)
      .pipe(
        catchError(this.handleError)
      );
  }
  private httpOptions = {
    headers: new HttpHeaders(
      {
        'Authorization': 'Basic REFSQTpNVEl6TkRVMg==',
        'Content-Type': 'application/json'
      }
    )
  };
  private headers = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'apiKey': 'ITnjVcrLWfYpY2B246EcrWO6Hln3LD7a'
      }
    )
  };
  authUrl = environment.auth_url;
  registraduriaURL = environment.registraduria_url;
  endpoint1 = 'https://webapi.uniminuto.edu/API/BannerEstudiante/DatosPersonales/';
  // endpoint1 = 'http://10.0.36.175:81/API/BannerEstudiante/DatosPersonales/';
  endpoint2 = 'https://registros.uniminuto.edu/api_egresado_act/json/mun.json';
  endpoint3 = 'https://registros.uniminuto.edu/api_egresado_act/json/dep.json';
  endpoint4 = 'https://registros.uniminuto.edu/api_egresado_act/json/residencia.json';
  endpoint5 = 'https://registros.uniminuto.edu/api_egresado_act/service/demografia.php?';
  endpoint6 = 'https://registros.uniminuto.edu/api_da/select/index.php?fn=da&correo';
  apiRegistraduria = 'https://uniminuto.api.digibee.io/pipeline/uniminuto/v1/consulta-cedulas/ConsultarCedulas';



  getPersonales(id: string): Observable<Estudiante> {

    return this._http.get<any>(`${this.endpoint1}/${id}`, this.httpOptions).pipe(
      switchMap(response => { return of(response.Estudiante) })
    )
  }

  ///////////////////////////////////
  // APIS para recuperar la cuenta de correo.
  consultarEgresado(documento: string, expedicion: string): Observable<any> {
    const body = `{\"Cedulas\":{\"NumeroIdentificacion\":[\"${documento}\"]}}`;
    const bodyCorreo = `{\"documento\": ${documento} }`;

    // const apiUrl1 = 'https://registros.uniminuto.edu/api_registraduria_bool/select/index.php?fn=verificacion&documento';
    const apiUrl2 = 'https://registros.uniminuto.edu/api_da/funct/da_pager_egresado.php?pager';
    const apiUrl3 = 'https://uniminuto.api.digibee.io/pipeline/uniminuto/v1/servicios-banner/consultarCorreo';
    const apiUrl4 = 'https://registros.uniminuto.edu/api_da/funct/da_pager_estudiante.php?pager';
    return this._http.post<Registraduria>(`${this.apiRegistraduria}`, body, this.headers)
      .pipe(
        switchMap((fecha: Registraduria): Observable<any> => {
          let expReg = fecha.EstadoConsulta.DatosCedulas[0].fechaExpedicion;
          if (expReg == expedicion) {
            return this._http.get(`${apiUrl2}=${documento}`)
              .pipe(
                switchMap((usuarioDA: Estudiante): Observable<any> | any => {   ///// VALIDAR ACÁ SI EL USUARIO ES UN ESTUDIANTE.... LUEGO SI CONTINUAR
                  if (usuarioDA.message == 'Documento no encontrado') {

                    return this._http.get<Estudiante>(`${apiUrl4}=${documento}`)
                      .pipe(
                        switchMap((estudiante: any): any => {
                          if (estudiante.message != 'Documento no encontrado') {
                            return of({
                              res: "estudiante",
                              correo: estudiante.message
                            });
                          } else {
                            return this._http.post<CorreoBanner>(`${apiUrl3}`, bodyCorreo, this.headers)
                              .pipe(
                                switchMap((mail: any): any => {
                                  let correo = JSON.parse(mail.body);
                                  if (correo) {
                                    return of({
                                      res: "banner",
                                      correo: correo.correo
                                    });
                                  }
                                  else {
                                    return of({
                                      res: "falso",
                                      code: "Usuario no pertenece a Uniminuto"
                                    })
                                  }
                                }
                                ));
                          }
                        }));


                  }
                  else {
                    return of(
                      {
                        res: "exitoso",
                        correo: usuarioDA
                      });
                  };
                }
                ));
          } else {
            return of({
              res: "error",
              UidEstudiante: "Datos incorrectos"
            }); // Retornar sin hacer más validaciones
          }
        }),
        catchError(error => {
          console.error('Error en la solicitud:', error);
          return throwError(error); // Reenviar el error para que sea manejado por el suscriptor
        }))
  }
  // Función que consulta el endpoint de autenticación desde Boomi
  // y si los datos son correctos, valida la fecha de expedición contra la resgistraduría
  // Si las dos anteriores son correctas, devuelve los datos de Boomi
  login(document: any, nacimiento: any, expedicion: any): Observable<Login> {
    const body = `{
                      \"Cedulas\":{\"NumeroIdentificacion\":[\"${document}\"]}}`;
    let doc: string = window.btoa(nacimiento);

    return this._http.get<Login>(`${this.authUrl}/${document}/${doc}/GRADUADO`).pipe(
      switchMap((usuario: Login) => {
        if (usuario.Cn != null) {
          return this._http.post<Registraduria>(`${this.apiRegistraduria}`, body, this.headers).pipe(
            switchMap((fecha) => {
              console.log(usuario);
              console.log(fecha);
              let expReg = fecha.EstadoConsulta.DatosCedulas[0].fechaExpedicion;
              console.log(expReg);

              if (expReg == expedicion) {
                this._acceso = true;
                return of(usuario);
              }
              return of({ Cn: 'Null' });
            })
          )
        }
        return of({ Cn: 'Null' });
      }))
  }
  logout() {
    this._acceso = false;
  }
  getDatosAcademicos(id: string): Observable<Academia[]> {
    return this._http.get<Academia[]>(`https://comunidad.uniminuto.edu/estudiantes/Estudiantes/ProgramasAll/${id}`)
  }
  getDatosMunicipio(codigo: string, departamento: string): Observable<MunicipioName> {
    return this._http.get<any>(`${this.endpoint2}`)
      .pipe(
        switchMap(response => {
          const municipios = response[0][departamento];
          municipios.sort((a: any, b: any) => a.nombre.localeCompare(b.nombre)); // Ordenar alfabéticamente
          return of(municipios);
        })
      )
  }
  getDatosDepartamento(): Observable<MunicipioName> {
    return this._http.get<any>(`${this.endpoint3}`)
  }
  getResidencia(): Observable<any> {
    return this._http.get<any>(`${this.endpoint4}`)
  }
  actualizarDatos(pager: string, cn: string, data: any): Observable<any> {
    const { barrio, celular, correo, departamento, direccion, municipio, pais, telefono, tipoDireccion } = data;
    
    // Limpieza adicional del correo
    let correo1 = correo.value.replace(/'/g, '').replace(/"/g, '').trim();
    
    // Codificación URL segura
    const params = new URLSearchParams();
    params.set('fn', 'actu');
    params.set('documento', btoa(pager));
    params.set('correo', btoa(correo1));
    params.set('telefono', btoa(celular.value));
    params.set('banner', btoa(cn));
    params.set('fijo', btoa(telefono.value));
    params.set('residencia', btoa(tipoDireccion.value));
    params.set('departamento', btoa(departamento.value));
    params.set('barrio', btoa(barrio.value));
    params.set('municipio', btoa(municipio.value));
    params.set('direccion', btoa(direccion.value));
  
    return this._http.get(`${this.endpoint5}?${params.toString()}`).pipe(
      map(response => {
        // Transforma la respuesta del servidor
        if (typeof response === 'string') {
          return response.includes('éxito') || response.includes('exito') || response.includes('1');
        }
        return response;
      }),
      catchError(error => {
        console.error('Error en actualizarDatos:', error);
        return throwError(() => new Error('Error en la actualización'));
      })
    );
  }
  //Traer nombres de Banner
  datosBanner(cedula: string): Observable<nombres> {    //Hay q pasar a producción
    // const apiUrl3 = 'https://endpoints.uniminuto.edu/consulta/consultarCorreo?cedula';
    const URL = "https://endpoints.uniminuto.edu/consulta/consultarNombres?cedula"
    // return of({ msg: "ok", nombres: "Diego, Espitia Supelano" })
    return this._http.get<nombres>(`${URL}=${cedula}`);
  }
  // Buscar correos
  buscarCorreo(correo: string): Observable<Login> {
    return this._http.get<Login>(`${this.endpoint6}=${correo}`)
      .pipe(switchMap((usuario): Observable<Login> => {
        if (usuario.hasOwnProperty("Cn")) {
          return of(usuario);
        } else {
          return of(usuario);
        }
      }
      )
      );
  }
  updateBanner(cedula: any, idBanner: any, correo: any, accion: any): Observable<any> {
    const URL = "https://endpoints.uniminuto.edu/consulta/crearActualizarCorreo";
    const data = {
      "cedula": cedula,
      "idBanner": idBanner,
      "correo": correo,
      "accion": accion
    }
    return this._http.post<any>(`${URL}`, data);
  }
  ///////////////////////////////////////////////////
  crearCorreo(nom: string, ape: string, doc: number, mail: string, cn: string): Observable<UsuarioDA | any> {
    const URL = "https://registros.uniminuto.edu/api_crearDA/index.php"   //Faltan CORS:    //Hay q pasar a producción
    const data = {
      "nombres": nom,
      "apellidos": ape,
      "pager": doc,
      "mail": mail
    };
    return this._http.post<UsuarioDA>(`${URL}`, data);
  }

  sendMail(mail: string, mailUMD: string, nombre: string) {
    mail = mail.replace(/'/g, '');
    let options = {
      'method': 'POST',
      'url': 'https://api.masiv.masivian.com/email/v1/delivery',
      'headers': {
        'Authorization': 'Basic RW1haWxWNF9VTklNSU5VVE9fMTcwMzpNdjQudmxKVDhiZTE=',
        'Content-Type': 'application/json'
      }
    };
    let body = JSON.stringify({
      "Subject": "Consulta de correo Uniminuto",
      "From": "Vive Uniminuto<viveuniminuto@uniminuto.edu>",
      "Template": {
        "Type": "text/html",
        "Value": `<div style =\"text-align:center\"><img alt=\"Logo Vive Uniminuto\" height=\"95\" src=\"https://masiv3.s3.amazonaws.com/ImageFiles/P1TIH2/logo_egresados.jpg\"\
          width=\"320\" /></div><h3><span style=\"font-family:Lucida Sans Unicode,Lucida Grande,sans-serif;\">Estimad@ egresado UNIMINUTO,</span></h3><br />\
          <span style=\"font-family:Lucida Sans Unicode,Lucida Grande,sans-serif;\">Has realizado una solicitud para consultar tu correo institucional de egresado.<br />\
          <br />Tu correo es: <strong> ${mailUMD} </strong><br /><br />
          Recuerda que a través de esta cuenta puedes acceder a nuestros servicios en Club Vive Uniminuto.</span><br /><br />
          Si deseas puedes modificar Tu Clave en <a href='tuclave.uniminuto.edu'>UNIMINUTO | Tu Clave </a>&nbsp;\
          <hr />&nbsp;<div style=\"text-align:center\"><img alt=\"Logo Uniminuto\" height=\"132\" src=\"https://masiv3.s3.amazonaws.com/ImageFiles/P1TIH2/Corporacion-Universitaria-Minuto-de-Dios-UNIMINUTO-01.jpg\" width=\"220\" /></div>`,
      },
      "Recipients": [
        {
          "To": `${nombre} <${mail}>`
        }
      ]
    });
    return this._http.post('https://api.masiv.masivian.com/email/v1/delivery', body, options);
  }
  sendSMS(tel: string, mail: string) {
    let options = {
      'method': 'POST',
      'url': 'https://api-sms.masivapp.com/send-message',
      'headers': {
        'Authorization': 'Basic VU5JTUlOVVRPX1NFUlZJQ0lPU0lOVEVHUkFET1NfVV82R1E6SVNhOV9uQ3Qpcg==',
        'Content-Type': 'application/json'
      }
    };
    let body = JSON.stringify({
      "to": `${tel}`,
      "text": `Hola egresad@ UNIMINUTO. Tu correo institucional es ${mail}. Con él puedes acceder a los servicios en Club Vive Uniminuto.`,
      "customdata": "CUS_ID_0125",
      "isPremium": false,
      "isFlash": false,
      "isLongmessage": false,
      "isRandomRoute": false,
      // "shortUrlConfig": {
      //   "url": "https://egresados.uniminuto.edu",
      //   "domainShorturl": "http://ma.sv/"
      // }
    });
    return this._http.post('https://api-sms.masivapp.com/send-message', body, options);
  }
  //Servicio para guard de autenticación
  checkAuthentication(): Observable<boolean> {
    return of(this._acceso);
  }
  estadisticas(documento: string, nombres: string, apellidos: string, sitio: string): Observable<any> {
    // const url = 'http://localhost:82/api/insert';
    const url = 'https://registros.uniminuto.edu/api_estadistica_egresados/api/insert';
    const data = {
      documento: documento,
      nombres: nombres,
      apellidos: apellidos,
      sitio: sitio
    };
    return this._http.post(`${url}`, data);
  }
  accionEstadistica(documento: string, accion: string): Observable<any> {
    const url = 'https://registros.uniminuto.edu/api_estadistica_egresados/api/update';
    const data = {
      documento: documento,
      accion: accion
    };
    return this._http.post(`${url}`, data);
  }
}
