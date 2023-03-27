import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Route } from '@angular/router';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotfoundComponent } from './app/notfound/notfound.component';
import { HttpClientModule } from '@angular/common/http';
import { mainGuard } from './app/guards/main.guard';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogoutComponent } from './app/logout/logout.component';

const routes: Route[] = [
  {
    path: '',
    component: AppComponent,
    children: [
      { path: '', loadChildren: () => import('./app/main/routes'), canActivate: [mainGuard] },
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'logout',
        component: LogoutComponent
      }
    ]
  },
  { path: '**', component: NotfoundComponent }
];

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, BrowserAnimationsModule, HttpClientModule),
    provideRouter(routes),
    { provide: MAT_DATE_LOCALE, useValue: 'id-ID' },
    MatSnackBar
  ]
}).catch(err => console.error(err));
