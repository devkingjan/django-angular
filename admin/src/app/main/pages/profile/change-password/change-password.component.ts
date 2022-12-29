import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MyErrorStateMatcher} from '../../../../../@fuse/utils/error-state-matcher';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangePasswordComponent implements OnInit {
    changForm: FormGroup;
    matcher = new MyErrorStateMatcher();
    constructor(
      private api: ApiService,
      private _snackBar: MatSnackBar,
      private _formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<ChangePasswordComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
          this.changForm = this._formBuilder.group({
              current_password: ['', Validators.required],
              new_password: ['', Validators.required],
              confirmPassword: ['', Validators.required],
          }, {validator: this.checkPasswords});
    }
    checkPasswords(group: FormGroup): any {
      const pass = group.get('new_password').value;
      const confirmPass = group.get('confirmPassword').value;
      return pass === confirmPass ? null : { notSame: true };
    }

    submit(): void {
        this.api.me.resetPwd(this.changForm.value).promise().then(resp => {
            this._snackBar.open('Password reset successfully!', 'Success', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.dialogRef.close();
        }).catch(resp => {
            let errorMessages = null;
            if ('current_password' in resp.error) {
                errorMessages = resp.error['current_password'];
            } else if ('new_password' in resp.error) {
                errorMessages = resp.error['new_password'];
            }
            const error = errorMessages.join('\n');
            this._snackBar.open(error, 'Error', {
              duration: 5000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
        });
    }
    
    cancel(): void {
        this.dialogRef.close();
    }

}

