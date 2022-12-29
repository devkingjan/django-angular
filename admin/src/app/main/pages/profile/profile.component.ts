import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../@fuse/api/api.service';
import {User} from '../../../models/user';
import {MatDialog} from '@angular/material/dialog';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {MatSnackBar} from '@angular/material/snack-bar';
let originUser: User = new User();
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
    baseForm: FormGroup;
    secureForm: FormGroup;
    emergencyForm: FormGroup;
    submittedBaseForm = false;
    public user: User = new User();
    constructor(
        private api: ApiService,
        private _formBuilder: FormBuilder,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.getUserInfo();
        this.initializeBaseForm();
        this.initializeSecureForm();
        this.initializeEmergencyForm();
    }
    getUserInfo(): void {
        this.api.me.get().promise().then(resp => {
            this.user = resp;
            originUser = Object.assign({}, this.user);
            this.initializeBaseForm();
            this.initializeEmergencyForm();
        });
    }
    initializeBaseForm(): void {
        this.baseForm = this._formBuilder.group({
            first_name   : [this.user.first_name, [Validators.required]],
            last_name   : [this.user.last_name, [Validators.required]],
            role   : [this.user.role, [Validators.required]],
            initials   : [this.user.initials, [Validators.required]],
            email   : [{
                    value   : this.user.email,
                    disabled: true
                }, [Validators.required, Validators.email]],
        }, {validator: this.checkChange});
    }
    initializeSecureForm(): void {
        this.secureForm = this._formBuilder.group({
            password   : ['******', []],
        });
    }
    initializeEmergencyForm(): void {
        this.emergencyForm = this._formBuilder.group({
           emergency_first_name: [this.user.emergency_first_name, [Validators.required]],
           emergency_last_name: [this.user.emergency_last_name, [Validators.required]]
        }, {validator: this.checkEmergencyChange});
    }
    changePwd(): void {
        const dialogRef = this.dialog.open(ChangePasswordComponent);
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });
    }
    checkChange(group: FormGroup): any {
        if (originUser.first_name !== group.get('first_name').value || originUser.last_name !== group.get('last_name').value ||
            originUser.role !== group.get('role').value || originUser.initials !== group.get('initials').value ) {
            return null;
        } else {
            return {not: true};
        }
    }
    checkEmergencyChange(group: FormGroup): any {
        if (originUser.emergency_first_name !== group.get('emergency_first_name').value ||
            originUser.emergency_last_name !== group.get('emergency_last_name').value) {
            return null;
        } else {
            return {not: true};
        }
    }
    submitBaseForm(): void {
        this.baseForm.value.email = this.user.email;
        this.api.me.update(this.baseForm.value).promise().then(resp => {
            this.user = resp;
            originUser = resp;
            this.initializeBaseForm();
            this._snackBar.open('User Info Updated!', 'Success', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
        }).catch(error => {
            this._snackBar.open('User Info Updated', 'Failed', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
        });
    }
    submitEmergencyForm(): void {
        this.emergencyForm.value.email = this.user.email;
        this.api.me.update(this.emergencyForm.value).promise().then(resp => {
            this.user = resp;
            originUser = resp;
            this.initializeEmergencyForm();
            this._snackBar.open('Emergency Info Updated!', 'Success', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
        }).catch(error => {
            this._snackBar.open('Emergency Info Updated', 'Failed', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
        });
    }
}
