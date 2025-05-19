import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AuthRoutingModule } from './auth-routing.module';

import { AuthComponent } from './auth.component';
import { Login1Component } from './pages/login1/login1.component';
import { EgresadosComponent } from './pages/egresados/egresados.component';
import { EstudiantesComponent } from './pages/estudiantes/estudiantes.component';
import { PreguntasComponent } from './pages/preguntas/preguntas.component';

@NgModule({
  declarations: [],
  
  imports: [
    CommonModule, 
    AuthRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AngularSvgIconModule.forRoot(),
    
    AuthComponent,
    Login1Component,
    EgresadosComponent,
    EstudiantesComponent,
    PreguntasComponent,
  ]
})
export class AuthModule { }