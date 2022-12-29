import { isString } from 'lodash';
import { Injectable } from '@angular/core';

@Injectable()
export class MeService {
  user?: any = null;
  token?: string = null;
  role?: number = null;

  constructor() { }

  setToken(token: string): void {
    this.token = token;
  }

  setUser(admin: any): any {
    this.user = admin;
    return admin;
  }

  forget(): void {
    this.token = null;
  }

}
