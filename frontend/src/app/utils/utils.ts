import { ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (formGroup: any): ValidationErrors | null => {
  if (formGroup.get('password')!.value === formGroup.get('repassword')!.value) return null;
  else return { passwordMismatch: true };
};
