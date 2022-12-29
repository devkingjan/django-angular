import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {MyErrorStateMatcher} from '../../pages/profile/change-password/change-password.component';
import {ApiService} from '../../../../@fuse/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UtilsService} from "../../../../@fuse/services/utils.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ResetPasswordComponent implements OnInit {
    uid: string;
    token: string;
    errorMessage: string = null;
    resetPwdForm: FormGroup;
    verifyState = false;
    matcher = new MyErrorStateMatcher();
    constructor(
        private _snackBar: MatSnackBar,
        private api: ApiService,
        private route: ActivatedRoute,
        private router: Router,
        private _formBuilder: FormBuilder,
        private utilsService: UtilsService
    ) {
        this.uid = this.route.snapshot.params['uid'];
        this.token = this.route.snapshot.params['token'];
        if (this.uid && this.token) {
          this.verifyState = true;
        } else {
          this.verifyState = false;
        }
    }

    ngOnInit(): void{
        this.resetPwdForm = this._formBuilder.group({
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
        this.errorMessage = null;
        const request = {
            uid: this.uid,
            token: this.token,
            new_password: this.resetPwdForm.value.new_password
        };
        this.api.me.forgotPwd(request).promise().then(resp => {
            this._snackBar.open('Password reset successfully!', 'Success', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.resetPwdForm.reset();
            setTimeout(() => {
                this.router.navigate(['/auth/login']);
            }, 3000);
        }).catch(resp => {
            this.errorMessage = this.utilsService.parseError(resp);
        });
    }
    

}
