import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FuseSharedModule } from '../../../@fuse/shared.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    {
        path        : 'login',
        component: LoginComponent
    },
    {
        path        : 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path        : 'reset-password/:uid/:token',
        component: ResetPasswordComponent
    },
    {
        path        : 'register/:user-role',
        component: RegisterComponent
    },
];

@NgModule({
  declarations: [
    LoginComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    RegisterComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    FuseSharedModule
  ]
 
})
export class AuthModule { }
