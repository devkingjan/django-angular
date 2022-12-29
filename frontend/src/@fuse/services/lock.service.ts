import { Injectable } from '@angular/core';

import { ApiService } from '../api/api.service';
import { MeService } from './me.service';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../app/models/user';
import { AuthService } from './auth.service';

@Injectable()
export class LockService {
  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  timeInterval = 30 * 60 * 1000;
  meUser: User;
  actionTime: number;
  constructor(
      private auth: AuthService,
      private api: ApiService,
      private me: MeService) {
      this.actionTime = new Date().getTime();
      setInterval(() => {
          const timeStamp = new Date().getTime();
          const differ = timeStamp - this.actionTime;
          if (differ > this.timeInterval && this.me.token) {
              this.triggerLock();
          }
      }, 1000);
  }
  
  setActionTime(): void {
    const d = new Date();
    const timeStamp = d.getTime();
    this.actionTime = timeStamp;
    localStorage.setItem('actionTime', this.actionTime.toString());
  }
  
  getActionTime(): number {
      return this.actionTime;
  }
  
  triggerLock(): void {
      this.api.me.get().promise().then(resp => {
          this.meUser = resp;
          this.auth.logout();
          this.lockPage(true);
      });
  }
  
  lockPage(value: boolean): void {
      this.status.next(value);
  }

}
