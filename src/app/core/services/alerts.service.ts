import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';



@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  mostrarError(arg0: string) {
      throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  errorLogin(text: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Datos incorrectos...',
      text: text,
    })
  }

  exitoso(text: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Proceso exitoso',
      text: text,
      // footer: '<a href="">Why do I have this issue?</a>'
    })
  }
  datosExitoso(text: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Actualización exitosa',
      text: text,
      // footer: '<a href="">Why do I have this issue?</a>'
    });
  }

  recuperaCorreo(text: string, icono: SweetAlertIcon, title: string): void {
    Swal.fire({
      icon: `${icono}`,
      title: `${title}`,
      text: text,
      footer: '<span class="font-medium">¿Olvidaste Tu Clave? Recupérala o cámbiala haciendo </span><a class="font-medium text-blue-500" href="https://tuclave.uniminuto.edu"> CLIC AQUÍ.</a>'
    })
  }

  errorCorreo(text: string, icono: SweetAlertIcon, title: string): void {
    Swal.fire({
      icon: `${icono}`,
      title: `${title}`,
      text: text,
    })
  }

  cargandoDatos(): void {
    Swal.fire({
      title: 'Verificando los datos',
      allowEscapeKey: false,
      allowOutsideClick: false,
      background: '#19191a',
      showConfirmButton: false,
      // onOpen: () => {
      // Swal.showLoading()
      // }

      // timer: 3000,
      // timerProgressBar: true
    });
    // Swal.fire('Please wait')
    Swal.showLoading()
  }


}
