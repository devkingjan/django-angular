import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../@fuse/api/api.service';
import {User} from '../../../models/user';
import {MatDialog} from '@angular/material/dialog';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UploadImageComponent} from './upload-image/upload-image.component';
import {FuseProgressBarService} from '../../../../@fuse/components/progress-bar/progress-bar.service';
import {MeService} from '../../../../@fuse/services/me.service';
import {ChangePinComponent} from './change-pin/change-pin.component';

let originUser: User = new User();

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ProfileComponent implements OnInit {
    avatar = 'assets/images/avatars/default.png';
    baseForm: FormGroup;
    secureForm: FormGroup;
    pinForm: FormGroup;
    emergencyForm: FormGroup;
    submittedBaseForm = false;
    updatedAvatar = false;
    public user: User = new User();
    
    constructor(
        private me: MeService,
        private api: ApiService,
        private _formBuilder: FormBuilder,
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
        private progressService: FuseProgressBarService,
    ) {
    }
    
    ngOnInit(): void {
        this.getUserInfo();
        this.initializeBaseForm();
        this.initializeSecureForm();
        this.initializePinForm();
        this.initializeEmergencyForm();
    }
    
    getUserInfo(): void {
        this.progressService.show();
        this.api.me.get().promise().then(resp => {
            this.progressService.hide();
            this.user = resp;
            this.updatedAvatar = false;
            this.avatar = this.user.signed_avatar_url;
            originUser = Object.assign({}, this.user);
            this.initializeBaseForm();
            this.initializeEmergencyForm();
            this.initializePinForm();
        });
    }
    
    initializeBaseForm(): void {
        this.baseForm = this._formBuilder.group({
            first_name: [this.user.first_name, [Validators.required]],
            last_name: [this.user.last_name, [Validators.required]],
            role: [this.user.role, [Validators.required]],
            initials: [this.user.initials, [Validators.required]],
            email: [{
                value: this.user.email,
                disabled: true
            }, [Validators.required, Validators.email]],
        }, {validator: this.checkChange});
    }
    
    initializeSecureForm(): void {
        this.secureForm = this._formBuilder.group({
            password: ['******', []],
        });
    }

    initializePinForm(): void {
        this.pinForm = this._formBuilder.group({
            pin: ['******', []],
        });
    }
    
    initializeEmergencyForm(): void {
        this.emergencyForm = this._formBuilder.group({
            emergency_first_name: [this.user.emergency_first_name, [Validators.required]],
            emergency_last_name: [this.user.emergency_last_name, [Validators.required]],
            telephone: [this.user.telephone, [Validators.required]],
            relation: [this.user.relation, [Validators.required]]
        }, {validator: this.checkEmergencyChange});
    }
    
    changePwd(): void {
        const dialogRef = this.dialog.open(ChangePasswordComponent);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    changePin(): void {
        const dialogRef = this.dialog.open(ChangePinComponent);
        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }
    
    checkChange(group: FormGroup): any {
        if (originUser.first_name !== group.get('first_name').value ||
            originUser.last_name !== group.get('last_name').value ||
            originUser.role !== group.get('role').value ||
            originUser.initials !== group.get('initials').value
        ) {
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
        this.progressService.show();
        if (this.updatedAvatar) {
            this.baseForm.value['avatar'] = this.avatar;
        }
        this.api.me.update(this.baseForm.value).promise().then(resp => {
            this.progressService.hide();
            this.user = resp;
            this.me.setUser(this.user);
            this.updatedAvatar = false;
            originUser = resp;
            this.initializeBaseForm();
            this._snackBar.open('User Info Updated!', 'Success', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
        }).catch(error => {
            this.progressService.hide();
            this._snackBar.open('User Info Updated', 'Failed', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
        });
    }
    
    openUploadImageDialog(): void {
        const dialogRef = this.dialog.open(UploadImageComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.avatar) {
                this.avatar = result.avatar;
                this.updatedAvatar = true;
                // this.progressService.show();
                // this.api.me.update({email: this.user.email, avatar: this.avatar}).promise().then(resp => {
                //     this.progressService.hide();
                //     this.user = resp;
                //     this.me.setUser(this.user);
                //     originUser = resp;
                //     this._snackBar.open('User image Updated!', 'Success', {
                //       duration: 3000,
                //       horizontalPosition: 'right',
                //       verticalPosition: 'top',
                //     });
                // }).catch(error => {
                //     this.progressService.hide();
                //     this._snackBar.open('Failed User image Update', 'Failed', {
                //       duration: 3000,
                //       horizontalPosition: 'right',
                //       verticalPosition: 'top',
                //     });
                // });
            }
        });
    }
    
    submitEmergencyForm(): void {
        this.progressService.show();
        this.emergencyForm.value.email = this.user.email;
        this.api.me.update(this.emergencyForm.value).promise().then(resp => {
            this.progressService.hide();
            this.user = resp;
            originUser = resp;
            this.initializeEmergencyForm();
            this._snackBar.open('Emergency Info Updated!', 'Success', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
        }).catch(error => {
            this.progressService.hide();
            this._snackBar.open('Emergency Info Updated', 'Failed', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
        });
    }
}
