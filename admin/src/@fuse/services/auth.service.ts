import { Injectable } from '@angular/core';

import { ApiService } from '../api/api.service';
import { MeService } from './me.service';

import { AuthData } from '../../app/models/auth-data';
import { User } from '../../app/models/user';

@Injectable()
export class AuthService {

  constructor(private api: ApiService, private me: MeService) { }

  rememberToken(token): void {
    localStorage.setItem('admin-token', token);
  }

  getToken(): string {
    return localStorage.getItem('admin-token');
  }

  canAutoLogin(): boolean {
    return this.getToken() !== null;
  }

  isAuthenticated(): boolean {
    return this.me.token !== null;
  }

  autoLogin(): Promise<User> {
    const token = this.getToken();
    if (token === null) {
      return Promise.reject({error: 'New user'});
    }
    this.me.setToken(token);
    return this.api.me.get().promise()
    .then((resp) => {
      this.me.setUser(resp.data);
      return resp.data;
    });
  }

  login(auth: AuthData): Promise<User> {
    return this.api.authToken.post(auth).promise()
      .then(token => {
        this.me.setToken(token.token);
        this.rememberToken(token.token);
      })
      .then(() => this.api.me.get().promise())
      .then((resp) => {
        this.me.setUser(resp.data);
        return resp.data;
      });
  }

  logout(): void {
    this.me.forget();
    localStorage.removeItem('admin-token');
  }

}
