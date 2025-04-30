import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function paisValidoValidator(paises: { nombre: string }[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || paises.length === 0) {
        return null;
      }
  
      const existe = paises.some(p => p.nombre.toLowerCase() === control.value.toLowerCase());
      return existe ? null : { paisInvalido: true };
    };
  }