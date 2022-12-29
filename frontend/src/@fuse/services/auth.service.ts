import { Injectable } from '@angular/core';

import { ApiService } from '../api/api.service';
import { MeService } from './me.service';

import { AuthData } from '../../app/models/auth-data';
import { User } from '../../app/models/user';
import {FuseConfigService} from "./config.service";

@Injectable()
export class AuthService {

  constructor(
      private api: ApiService,
      private me: MeService,
      private _fuseConfigService: FuseConfigService,
  ) { }

  rememberToken(token): void {
    localStorage.setItem('token', token);
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  canAutoLogin(): boolean {
    return this.getToken() !== null;
  }

  isAuthenticated(): boolean {
    const actionTime = localStorage.getItem('actionTime');
    const d = new Date();
    const currentTime = d.getTime();
    const timeDiff = currentTime - parseInt(actionTime, 10);
    if (timeDiff > 1000 * 60) {
        localStorage.setItem('actionTime', null);
        this.me.setToken(null);
        return false;
    }
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
      this.me.setUser(resp);
      return resp;
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
        this.me.setUser(resp);
        return resp;
      });
  }

  logout(): void {
    this.me.forget();
    this._fuseConfigService.config = {colorTheme: 'theme-default'};
    localStorage.removeItem('token');
  }

}
