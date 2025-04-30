import { Component } from '@angular/core';
import { token, datosAcademicos, Salida, Personales, Departamentos, Municipios, Paises } from 'src/app/core/interfaces/uniminuto.interface';
import { UniminutoService } from 'src/app/core/services/uniminuto.service';

import { jwtDecode } from "jwt-decode";
import { lastValueFrom } from 'rxjs';
import { AlertsService } from 'src/app/core/services/alerts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.css']
})
export class SharedComponent {
  datos: token;
  academia: Salida[] = [];
  datosPersonales: Personales = {} as Personales;
  cargado: boolean = false;
  departamentos: Departamentos[] = [];
  municipios: Municipios[] = [];
  paises: Paises[] = [];
  constructor(
    private readonly _umd: UniminutoService,
    private readonly _alert: AlertsService,
    private readonly _router: Router
  ) {
    this.datos = sessionStorage.getItem('auth_token') ? jwtDecode(sessionStorage.getItem('auth_token')!) : {} as token;
    if (!this.datos) {
      return;
    }
  }

  ngOnInit() {
    this.cargado = true;
    this._umd.getDatosAcademicos(this.datos.idBanner!).subscribe({
      next: (academia: datosAcademicos) => {
        this.academia.push(...academia.salida);
        this.datosPersonales = academia.personales;
        this.cargado = false;
      },
      error: (error) => {
        this.cargado = false;
        this._alert.errorGeneral('Por favor comuniquese con la mesa de ayuda a través de https://soporte.uniminuto.edu');
        this._router.navigate(['/login']); // Redirige al home
        return error;
      },
      complete: () => {
        this.cargado = false;
      }
    });
  }
}

