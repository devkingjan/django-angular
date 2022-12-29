import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import {AuthService} from './auth.service';
import {MeService} from './me.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  failedUrl?: string = null;
  constructor(private auth: AuthService, private router: Router, private me: MeService) {
  }

  consumeFailedUrl(): string {
    const url = this.failedUrl;
    this.failedUrl = null;
    return url;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (this.auth.isAuthenticated()) {
        if (this.me.meUser.user_role === 0) {
            this.router.navigate(['/pages/experiments']);
        } else {
            this.router.navigate(['/pages/dashboard']);
        }
    }
    if (this.auth.canAutoLogin()) {
      return this.auth.autoLogin()
        .then(() => {
            if (this.me.meUser.user_role === 0) {
                this.router.navigate(['/pages/experiments']);
            } else {
                this.router.navigate(['/pages/dashboard']);
            }
            return Promise.resolve(true);
        })
        .catch(() => {
          return Promise.resolve(true);
        });
    }
    return Promise.resolve(true);
  }

}
