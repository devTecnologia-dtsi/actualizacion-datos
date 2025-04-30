import { AbstractControl, ValidatorFn } from '@angular/forms';

export function direccionValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const direccion = control.value;
        const palabras = direccion.split(' ').filter((palabra: any) => palabra.trim() !== ''); // Obtener palabras no vacías
        return palabras.length >= 4 ? null : { direccionInvalida: true };
    };
}