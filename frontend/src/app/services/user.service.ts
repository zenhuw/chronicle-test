import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User, UserListRequest, UserListResponse } from '../interfaces/user.interface';
import { omit } from 'ramda';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) {}

  getUserList(request: UserListRequest) {
    return this.httpClient.get<UserListResponse>(`${environment.API_ENDPOINT}users`, {
      params: { ...request },
      withCredentials: true
    });
  }

  updateUser(id: string, user: User) {
    const userNoId = omit(['id'], user);
    return this.httpClient.put(`${environment.API_ENDPOINT}users/${id}`, { ...userNoId }, { withCredentials: true });
  }

  deleteUser(id: string) {
    return this.httpClient.delete(`${environment.API_ENDPOINT}users/${id}`, { withCredentials: true });
  }
}
