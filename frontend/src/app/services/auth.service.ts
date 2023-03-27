import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserRegisterRequest } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) {}

  checkLogin() {
    return this.httpClient.get(`${environment.API_ENDPOINT}auth/me`, { withCredentials: true });
  }

  login(email: string, password: string) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}auth/login`,
      { email, password },
      { withCredentials: true }
    );
  }

  register(user: UserRegisterRequest) {
    return this.httpClient.post(`${environment.API_ENDPOINT}auth/register`, user);
  }

  changePassword(password: { new_password: string; old_password: string }) {
    return this.httpClient.post(
      `${environment.API_ENDPOINT}auth/change-password`,
      { ...password },
      { withCredentials: true }
    );
  }

  logout() {
    return this.httpClient.post(`${environment.API_ENDPOINT}auth/logout`, {}, { withCredentials: true });
  }
}
