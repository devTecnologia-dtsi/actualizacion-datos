import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FuncionesService } from 'src/app/core/services/funciones.service';
import { AlertsService } from 'src/app/core/services/alerts.service';
 
@Component({
  selector: 'app-preguntas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preguntas.component.html',
  styleUrls: ['./preguntas.component.css']
})
export class PreguntasComponent implements OnInit {
  cargando = true;
  numPregunta = 0;
  totalPreguntas = 5;
  respuestaSeleccionada: string | null = null;
 
  preguntasMap: Record<string, string> = {};
  preguntasArray: { clave: string, valor: string }[] = [];
  respuestasArray: string[] = [];
  validarResSAP = false;
  respuestasUsuario: { clave: string, respuesta: string }[] = [];
 
  constructor(
    private funcionesService: FuncionesService,
    private router: Router,
    private alertsService: AlertsService
  ) {}
 
  ngOnInit(): void {
    this.inicializarPreguntas();
  }
 
  inicializarPreguntas(): void {
    this.preguntasMap = this.funcionesService.obtenerPreguntasAleatorias();
    const clavesPreguntas = Object.keys(this.preguntasMap);
   
    this.preguntasArray = clavesPreguntas
      .slice(0, this.totalPreguntas)
      .map(clave => ({
        clave,
        valor: this.preguntasMap[clave]
      }));
 
    this.cargarPreguntaActual();
  }
 
  getLetter(index: number): string {
    return String.fromCharCode(65 + index);
  }
 
  cargarPreguntaActual(): void {
    this.cargando = true;
    this.respuestaSeleccionada = null;
 
    setTimeout(() => {
      if (this.numPregunta >= this.preguntasArray.length) {
        this.finalizarCuestionario();
        return;
      }
 
      const claveActual = this.preguntasArray[this.numPregunta].clave;
      this.respuestasArray = this.obtenerOpciones(claveActual);
      this.validarResSAP = claveActual.includes('Sap');
     
      this.cargando = false;
    }, 700);
  }
 
  obtenerOpciones(clave: string): string[] {
    const opciones: Record<string, string[]> = {
      pCorreo: ['correo1@gmail.com', 'correo2@hotmail.com', 'correo3@uniminuto.edu', 'correo4@yahoo.com', 'correo5@outlook.com'],
      pDireccion: ['Calle 123', 'Carrera 45', 'Avenida Siempre Viva', 'Transversal 78', 'Diagonal 99'],
      pCiudadNac: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena'],
      pFechaNac: ['01/01/1990', '15/05/1992', '20/10/1988', '30/03/1995', '12/12/1985'],
      pTelefono: ['3101234567', '3117654321', '3121112233', '3134445566', '3147778899'],
      pPrograma: ['Ingeniería de Sistemas', 'Contaduría Pública', 'Psicología', 'Administración de Empresas', 'Derecho'],
      pSapBeca: ['Sí', 'No'],
      pSapDevolucion: ['Sí', 'No'],
      pSapIcetex: ['Sí', 'No'],
      pSemestre: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      pJornada: ['Mañana', 'Tarde', 'Noche', 'Fin de semana', 'Virtual']
    };
 
    return opciones[clave] || ['Opción 1', 'Opción 2', 'Opción 3', 'Opción 4', 'Opción 5'];
  }
 
  seleccion(respuesta: string): void {
    this.respuestaSeleccionada = respuesta;
  }
 
  siguientePregunta(): void {
    if (!this.respuestaSeleccionada) {
      this.alertsService.mostrarError('Por favor selecciona una respuesta');
      return;
    }
 
    this.respuestasUsuario.push({
      clave: this.preguntasArray[this.numPregunta].clave,
      respuesta: this.respuestaSeleccionada
    });
 
    this.funcionesService.guardarValidacion({
      pregunta: this.preguntasArray[this.numPregunta].clave,
      respuesta: this.respuestaSeleccionada
    });
 
    this.numPregunta++;
   
    if (this.numPregunta < this.totalPreguntas) {
      this.cargarPreguntaActual();
    } else {
      this.finalizarCuestionario();
    }
  }
 
  finalizarCuestionario(): void {
    this.router.navigate(['/dashboard']);
  }
}