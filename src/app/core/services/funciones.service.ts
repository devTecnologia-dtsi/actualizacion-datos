import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class FuncionesService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() { }

  obtenerPreguntasAleatorias(): Record<string, string> {
    const preguntas: Record<string, string> = {
      pFechaNac: "Cual es tu fecha de nacimiento",
      pCorreo: "Con cual de los siguientes correos has tenido relación",
      pDireccion: "Con cual de las siguientes direcciones tienes o has tenido relación",
      pCiudadNac: "Cual es tu lugar de nacimiento",
      pPrograma: "Cual de los siguientes programas estás estudiando o estudiaste en UNIMINUTO.",
      pTelefono: "Con cual de los siguientes teléfonos tienes o has tenido relación",
      pSapBeca: "En los últimos dos años has sido beneficiario de alguna beca",
      pSapDevolucion: "En los últimos dos años has solicitado alguna devolución",
      pSapIcetex: "En los últimos dos años has tramitado crédito con el icetex"
    };
  
    const opciones = Object.keys(preguntas);
    const preguntasAleatorias: string[] = [];
  
    while (preguntasAleatorias.length < 4) {
      const index = Math.floor(Math.random() * opciones.length);
      const pregunta = opciones[index];
      if (!preguntasAleatorias.includes(pregunta)) {
        preguntasAleatorias.push(pregunta);
      }
    }
  
    const preguntasJSON: Record<string, string> = {};
    preguntasAleatorias.forEach(pregunta => {
      preguntasJSON[pregunta] = preguntas[pregunta];
    });
  
    return preguntasJSON;
  }
  

  // Mejorar el tipo de `validacion`
  guardarValidacion(validacion: unknown): void {
    sessionStorage.setItem('validacion', JSON.stringify(validacion));
  }
}
