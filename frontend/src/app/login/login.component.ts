import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { catchError, of, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  hide = true;
  subscription: Subscription | undefined;

  constructor(private authService: AuthService, private router: Router, private snackbar: MatSnackBar) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  login() {
    if (!this.loginForm.valid) {
      return;
    }
    this.subscription = this.authService
      .login(this.loginForm.controls.email.value || '', this.loginForm.controls.password.value || '')
      .pipe(
        catchError((err, caught) => {
          this.snackbar.open('Email or password is wrong', 'Close');
          return of(null);
        })
      )
      .subscribe(res => {
        if (res) {
          this.router.navigateByUrl('').then();
        }
      });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
