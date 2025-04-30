import { Component, EventEmitter, Output } from '@angular/core';
import { DireccionModal, Residencia } from 'src/app/core/interfaces/uniminuto.interface';
import { UniminutoService } from 'src/app/core/services/uniminuto.service';

@Component({
  selector: 'app-modal-direccion',
  templateUrl: './modal-direccion.component.html',
  styleUrls: ['./modal-direccion.component.css']
})
export class ModalDireccionComponent {

  constructor(private readonly _umd: UniminutoService) {
    this._umd.getResidencia().subscribe((data: any) => {
      this.residencial = data.Residencia;
    })

  }

  @Output() close = new EventEmitter<void>();
  @Output() enviarDireccion = new EventEmitter<DireccionModal>(); // Agregamos un evento para enviar la información al componente padre

  via: string = '';
  seccionUno: string = '';
  seccionDos: string = '';
  seccionTres: string = '';
  seccionCuatro: string = '';
  seccionCinco: string = '';
  seccionSeis: string = '';
  seccionSiete: string = '';
  residencial: Residencia[] = [];

  enviarFormulario() {
    this.enviarDireccion.emit({ via: this.via, seccionUno: this.seccionUno, seccionDos: this.seccionDos, seccionTres: this.seccionTres, seccionCuatro: this.seccionCuatro, seccionCinco: this.seccionCinco, seccionSeis: this.seccionSeis, seccionSiete: this.seccionSiete }); // Emitimos el evento con la información recibida
    this.cerrarModal();
  }

  cerrarModal() {
    this.close.emit(); // Emitimos el evento para cerrar el modal
  }

}
