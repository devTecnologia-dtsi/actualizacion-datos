import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AngularSvgIconModule } from 'angular-svg-icon';

import { AuthComponent } from './auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { LoginComponent } from './pages/login/login.component';
import { SecurityComponent } from './pages/security/security.component';

@NgModule({
  declarations: [
    LoginComponent,
    SecurityComponent,
    AuthComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    HttpClientModule,
    AngularSvgIconModule.forRoot(),
    ReactiveFormsModule,
    DashboardModule
  ],
  providers: [
    DatePipe
  ],
})
export class AuthModule { }
