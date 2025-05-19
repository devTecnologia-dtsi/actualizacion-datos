import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  imports: [
    CommonModule,
    RouterModule 
  ]
})
export class AuthComponent {
  miga: string = '';
  cambiarColorFondo = false;

  constructor(private router: Router) { }

  cambiarColor() {
    this.cambiarColorFondo = !this.cambiarColorFondo;
  }

  ngOnInit() {
    const url = this.router.url;
    const lastSegment = url.split('/').pop();

    if (lastSegment === 'login') {
      this.miga = 'Actualiza tus datos';
    } else if (lastSegment === 'recuperarCorreo') {
      this.miga = 'Consulta tu correo';
    }
  }
}