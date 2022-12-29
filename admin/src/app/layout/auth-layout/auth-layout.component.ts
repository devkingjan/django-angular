import {Component, HostListener, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { navigation } from 'app/navigation/navigation';
import { LockService } from '../../../@fuse/services/lock.service';

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

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     */
    constructor(
        private lockService: LockService,
        private _fuseConfigService: FuseConfigService
    )
    {
        // Set the defaults
        this.navigation = navigation;

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
            console.log()
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
