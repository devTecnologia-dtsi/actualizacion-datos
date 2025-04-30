import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {

  miga: string = ''
  cambiarColorFondo = false;

  constructor(private router: Router) { }

  cambiarColor(){

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
