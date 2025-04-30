import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedComponent } from './shared/shared.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { NavbarMenuComponent } from './shared/navbar-menu/navbar-menu.component';
import { ProfileMenuComponent } from './shared/profile-menu/profile-menu.component';
import { NavbarMobileComponent } from './shared/navbar-mobile/navbar-mobile.component';
import { FormularioTablaComponent } from './shared/formulario-tabla/formulario-tabla.component';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDireccionComponent } from './shared/modal-direccion/modal-direccion.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SharedComponent,
    NavbarComponent,
    NavbarMenuComponent,
    ProfileMenuComponent,
    NavbarMobileComponent,
    FormularioTablaComponent,
    ModalDireccionComponent,
    
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    AngularSvgIconModule.forRoot(),
    ReactiveFormsModule
  ]
})
export class DashboardModule { }
