import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  failedUrl?: string = null;
  constructor(private auth: AuthService, private router: Router) {
  }

  consumeFailedUrl(): string {
    const url = this.failedUrl;
    this.failedUrl = null;
    return url;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/pages/dahsboard']);
    }
    if (this.auth.canAutoLogin()) {
      return this.auth.autoLogin()
        .then(() => {
            this.router.navigate(['/pages/dahsboard']);
            return Promise.resolve(true);
        })
        .catch(() => {
          return Promise.resolve(true);
        });
    }
    return Promise.resolve(true);
  }

}
