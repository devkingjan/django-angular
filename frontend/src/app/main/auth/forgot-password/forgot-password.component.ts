import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { Router} from '@angular/router';
import {MyErrorStateMatcher} from '../../pages/profile/change-password/change-password.component';
import {ApiService} from '../../../../@fuse/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UtilsService} from '../../../../@fuse/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ForgotPasswordComponent implements OnInit {
    errorMessage: string = null;
    sendMailForm: FormGroup;
    matcher = new MyErrorStateMatcher();
    constructor(
        private _snackBar: MatSnackBar,
        private api: ApiService,
        private router: Router,
        private _formBuilder: FormBuilder,
        private utilsService: UtilsService
    ) {
    }

    ngOnInit(): void{
        this.sendMailForm = this._formBuilder.group({
              email: ['', [Validators.required, Validators.email]],
          });
    }
 
    submit(): void {
        this.errorMessage = null;
        this.api.me.sendMailForResetPwd(this.sendMailForm.value).promise().then(resp => {
            this._snackBar.open('Sent mail to your mailbox, please check', 'Notice', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.sendMailForm.reset();
        }).catch(resp => {
            this.errorMessage = this.utilsService.parseError(resp);
        });
    }
    
    back(): void {
        history.back();
    }
    

}
