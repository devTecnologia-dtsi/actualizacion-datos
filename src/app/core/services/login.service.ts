import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { errorLogin, successLogin } from '../interfaces/login.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private _http: HttpClient,
    private readonly _router: Router) { }

  login(documento: string, nacimiento: string, expedicion: string, politica: string, tipoDoc: string): Observable<errorLogin | successLogin> {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'apiKey': environment.apikeyLogin,
    });
    const params = new HttpParams()
      // .set('documento', documento)
      .set('politica', politica)
      .set('nacimiento', nacimiento)
      .set('tipoDoc', tipoDoc)
      .set('expedicion', expedicion);
    return this._http.get<errorLogin | successLogin>(`${environment.actualizacion}/login/${documento}`, { headers, params });
  }
  logout() {
    sessionStorage.removeItem('auth_token');
    this._router.navigate(['/login']);
  }
  // login(document: any, nacimiento: any, expedicion: any): Observable<Login> {
  //   let doc: string = window.btoa(nacimiento);
  // }

}
