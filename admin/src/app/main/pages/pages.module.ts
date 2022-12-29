import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent} from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { FuseSharedModule } from '@fuse/shared.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CompaniesComponent } from './companies/companies.component';
import { NewCompanyComponent } from './companies/new-company/new-company.component';
import { MatTableModule } from '@angular/material/table';
import {MatMenuModule} from '@angular/material/menu';
import {MatChipsModule} from '@angular/material/chips';
import { SendInvitationComponent } from './companies/send-invitation/send-invitation.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FuseProgressBarService} from "../../../@fuse/components/progress-bar/progress-bar.service";

const routes: Routes = [
    {
        path        : 'dashboard',
        component: DashboardComponent
    },
    {
        path        : 'profile',
        component: ProfileComponent
    },
    {
        path        : 'companies',
        component: CompaniesComponent
    },
    {
        path        : 'companies/new',
        component: NewCompanyComponent
    },
    {
        path        : '**',
        redirectTo: 'dashboard'
    }
];

@NgModule({
    declarations: [
      DashboardComponent,
      ProfileComponent,
      ChangePasswordComponent,
      CompaniesComponent,
      NewCompanyComponent,
      SendInvitationComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTableModule,
        MatMenuModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        // MatProgressButtonsModule,
        FuseSharedModule,
        CommonModule,
        ColorPickerModule,
    ],
    providers: [
    ]
})
export class PagesModule { }
