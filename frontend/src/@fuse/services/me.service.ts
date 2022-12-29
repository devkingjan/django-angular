import { isString } from 'lodash';
import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../../app/models/user';

@Injectable()
export class MeService {
  user: BehaviorSubject<User>;
  meUser: User;
  token?: string = null;
  role?: number = null;
  permissions: number[] = [];

  constructor() {
      this.user = new BehaviorSubject({});
  }

  setToken(token: string): void {
    this.token = token;
  }

  setUser(user: any): void {
    this.user.next(user);
    this.meUser = user;
  }
  
  get getUser(): Observable<any>
    {
        return this.user.asObservable();
    }

  forget(): void {
    this.token = null;
  }

}
