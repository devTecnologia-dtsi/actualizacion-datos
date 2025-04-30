import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noContieneEnie(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;
    if (value && value.indexOf('ñ') !== -1 || value && value.indexOf('Ñ') !== -1) {
        return { contieneEnie: true };
    }
    return null;
}