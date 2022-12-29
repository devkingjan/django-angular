import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AuthGuardService } from '../@fuse/services/auth-guard.service';
import { ApiService } from '../@fuse/api/api.service';
import { MeService } from '../@fuse/services/me.service';
import { RequestService } from '../@fuse/api/request.service';
import { AuthService } from '../@fuse/services/auth.service';
import { PageGuardService } from '../@fuse/services/page-guard.service';
import {LockService} from '../@fuse/services/lock.service';
import {UtilsService} from '../@fuse/services/utils.service';
import { ConfirmModalComponent } from './main/components/confirm-modal/confirm-modal.component';

const appRoutes: Routes = [
    {
        path        : 'auth',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./main/auth/auth.module').then(m => m.AuthModule),
    },
    {
        path        : 'admin',
        component: AuthLayoutComponent,
        canActivate: [PageGuardService],
        loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
    },
    {
        path      : '**',
        redirectTo: 'admin/dashboard'
    }
];

@NgModule({
    declarations: [
        AppComponent,
        ConfirmModalComponent,
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        // App modules
        LayoutModule,
    ],
    providers: [
        UtilsService,
        ApiService,
        LockService,
        MeService,
        RequestService,
        AuthService,
        AuthGuardService,
        PageGuardService,
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
