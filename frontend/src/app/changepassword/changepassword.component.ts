import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../utils/utils';
import { catchError, of, Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-changepassword',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})
export class ChangepasswordComponent implements OnDestroy {
  hideOldPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  subscription: Subscription | undefined;

  changePasswordForm = new FormGroup(
    {
      old_password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      repassword: new FormControl('', { nonNullable: true, validators: [Validators.required] })
    },
    { validators: passwordMatchValidator }
  );

  constructor(private router: Router, private authService: AuthService, private snackbar: MatSnackBar) {}

  changePassword() {
    if (!this.changePasswordForm.valid) {
      return;
    }
    const value = this.changePasswordForm.getRawValue();
    this.subscription = this.authService
      .changePassword({
        new_password: value.password,
        old_password: value.old_password
      })
      .pipe(
        catchError((res, caught) => {
          this.snackbar.open('Something went wrong, check your input again', 'Close');

          return of(null);
        })
      )
      .subscribe(res => {
        if (res) {
          this.snackbar.open('Password has been changed', 'Close');
          this.router.navigateByUrl('/login').then();
        }
      });
  }

  onPasswordInput() {
    if (this.changePasswordForm.hasError('passwordMismatch'))
      this.changePasswordForm.controls.repassword.setErrors([{ passwordMismatch: true }]);
    else this.changePasswordForm.controls.repassword.setErrors(null);
  }

  backToHome() {
    this.router.navigateByUrl('/').then();
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
