import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { passwordMatchValidator } from '../utils/utils';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { omit } from 'ramda';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Sex {
  value: string;
  viewValue: string;
}

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL'
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY'
  }
};

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class RegisterComponent implements OnDestroy {
  hidePassword = true;
  hideConfirmPassword = true;
  subscription: Subscription | undefined;
  sexList: Sex[] = [
    { value: 'm', viewValue: 'Male' },
    { value: 'f', viewValue: 'Female' }
  ];

  registerForm = new FormGroup(
    {
      first_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      last_name: new FormControl('', { nonNullable: true }),
      sex: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      date_of_birth: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      address: new FormControl('', { nonNullable: true }),
      email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      repassword: new FormControl('', { nonNullable: true, validators: [Validators.required] })
    },
    { validators: passwordMatchValidator }
  );

  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar) {}

  onPasswordInput() {
    if (this.registerForm.hasError('passwordMismatch'))
      this.registerForm.controls.repassword.setErrors([{ passwordMismatch: true }]);
    else this.registerForm.controls.repassword.setErrors(null);
  }

  register() {
    if (!this.registerForm.valid) {
      return;
    }
    const value = omit(['repassword'], this.registerForm.getRawValue());
    this.subscription = this.authService.register({ ...value }).subscribe(res => {
      if (res) {
        this.router.navigateByUrl('/login');
        this.snackbar.open('User has been created', 'Close');
      }
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
