import {Component, HostListener, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { adminNavigation, regularNavigation, navigation } from 'app/navigation/navigation';
import { LockService } from '../../../@fuse/services/lock.service';
import {MeService} from '../../../@fuse/services/me.service';
import {User} from '../../models/user';
import {FuseNavigationService} from '../../../@fuse/components/navigation/navigation.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AuthLayoutComponent implements OnInit, OnDestroy
{
    showLockScreen = false;
    fuseConfig: any;
    navigation: any;
    user: User;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param lockService
     * @param me
     * @param {FuseConfigService} _fuseConfigService
     * @param _fuseNavigationService
     */
    constructor(
        private lockService: LockService,
        private me: MeService,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
    )
    {
        // Set the defaults
        this.me.getUser
            .pipe()
            .subscribe((user) => {
                this.user = user;
                this._fuseConfigService.config = {colorTheme: this.user.color_mode}
                if (this.user.user_role === 0) {
                     this._fuseNavigationService.setCurrentNavigation('regular');
                } else if (this.user.user_role === 1) {
                     this._fuseNavigationService.setCurrentNavigation('admin');
                } else {
                    this.navigation = navigation;
                }
            });
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    @HostListener('click') onClick(){
        this.lockService.setActionTime();
    }
    @HostListener('keydown', ['$event']) onKeyDown(e) {
        this.lockService.setActionTime();
    }
    @HostListener('document:mousemove', ['$event']) onMouseMove(e) {
        this.lockService.setActionTime();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });
        this.lockService.status.subscribe((val: boolean) => {
            this.showLockScreen = val;
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
