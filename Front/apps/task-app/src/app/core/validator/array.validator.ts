import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const arrayValidator = (allowed: string[]): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
      const val = control.value;
      if (val === null || val === undefined || val === '') {
        return { invalidPriority: true };
      }
      return allowed.includes(val) ? null : { invalidPriority: true };
    };
  }