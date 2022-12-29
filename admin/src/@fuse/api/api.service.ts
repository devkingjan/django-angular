import {Injectable} from '@angular/core';
import * as _ from 'lodash';

import {RequestService} from './request.service';
import {AuthData} from '../../app/models/auth-data';

@Injectable()
export class ApiService {
  authToken = {
    post: (auth: AuthData) => this.request
      .post()
      .url('auth/admin/login')
      .payload(auth),
  };
  me = {
    get: () => this.request
      .get()
      .url('auth/me')
      .auth(),
    update: (userObj) => this.request
      .put()
      .url('auth/users/update')
      .payload(userObj)
      .auth(),
    resetPwd: (pwdObj) => this.request
      .post()
      .url('auth/password')
      .payload(pwdObj)
      .auth(),
    sendMailForResetPwd: (pwdObj) => this.request
      .post()
      .url('auth/password/reset/')
      .payload(pwdObj),
    forgotPwd: (pwdObj) => this.request
      .post()
      .url('auth/password/reset/confirm/')
      .payload(pwdObj),
    logout: () => this.request
      .post()
      .url('auth/password')
      .auth(),
  };
  user = {
    post: (auth: AuthData) => this.request
      .post()
      .url('auth/users/login')
      .payload(auth),
  };
  company = {
    create: (obj) => this.request
      .post()
      .url('base/company/entity')
      .payload(obj)
      .auth(),
    update: (obj) => this.request
      .put()
      .url(`base/company/${obj.id}/update`)
      .payload(obj)
      .auth(),
    get: () => this.request
      .get()
      .url('base/company/entity')
      .auth(),
    invite: (obj) => this.request
      .post()
      .url('base/company/invite')
      .payload(obj)
      .auth(),
  };
  
  
  constructor(private request: RequestService) {
  }

}
