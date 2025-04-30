import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { nombres, Paises, Departamentos, Municipios, datosAcademicos, Residencia, PutActualizacion } from '../interfaces/uniminuto.interface';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UniminutoService {
  private _acceso: boolean = false;
  constructor(
    private _http: HttpClient
  ) { }
  // Definición de variables
  private headersDigibee = {
    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'apiKey': environment.apikeyLogin,
      }
    )
  };

  private token = sessionStorage.getItem('auth_token') || '';

  private headersDigibeeJWT = {


    headers: new HttpHeaders(
      {
        'Content-Type': 'application/json',
        'apiKey': environment.apikeyLogin,
        'Authorization': `${this.token}`
      }
    )
  };
  private datos_personales = environment.actualizacion;

  getPrefijo(idPais: string): Observable<Object> {
    return this._http.get<Object>(`${this.datos_personales}/Paises/${idPais}`, this.headersDigibee);
  }

  getDemografia(site: string, pais: string, depto: string): Observable<Paises[]> {
    let peticion = '';
    if (pais !== '') {
      peticion = `${this.datos_personales}?demografia=${site}&pais=${pais}`;
      return this._http.get<Departamentos[]>(peticion, this.headersDigibee).pipe(
        map((response: any) => response.Departamentos)
      );
    } else if (depto !== '') {
      peticion = `${this.datos_personales}?demografia=${site}&departamento=${depto}`;
      return this._http.get<Municipios[]>(peticion, this.headersDigibee).pipe(
        map((response: any) => response.Municipios)
      );
    } else {
      peticion = `${this.datos_personales}?demografia=${site}`;
      return this._http.get<Paises[]>(peticion, this.headersDigibee).pipe(
        map((response: any) => response.Paises)
      );
    }
  }
  getDatosAcademicos(id: string): Observable<datosAcademicos> {
    return this._http.get<datosAcademicos>(`${this.datos_personales}/usuarios/${id}`, this.headersDigibee)
  }

  getResidencia(): Observable<Residencia> {
    return this._http.get<Residencia>(`${this.datos_personales}?demografia=Residencia`, this.headersDigibee);
  }

  actualizarDatos(idBanner: string, data: any): Observable<PutActualizacion> {
    return this._http.put<PutActualizacion>(`${this.datos_personales}/${idBanner}`, data, this.headersDigibeeJWT);
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
}