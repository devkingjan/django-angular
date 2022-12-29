import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { LockService } from '../../../../@fuse/services/lock.service';
import { User } from '../../../models/user';
import {AuthService} from '../../../../@fuse/services/auth.service';
import {AuthData} from '../../../models/auth-data';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FuseProgressBarService} from '../../../../@fuse/components/progress-bar/progress-bar.service';

@Component({
  selector: 'app-lock',
  templateUrl: './lock.component.html',
  styleUrls: ['./lock.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class LockComponent implements OnInit {
    errorMessage: string = null;
    lockForm: FormGroup;
    meUser: User;
    constructor(
        private lockService: LockService,
        private _formBuilder: FormBuilder,
        private auth: AuthService,
        private _snackBar: MatSnackBar,
        private progressService: FuseProgressBarService,
    ) {
        this.meUser = lockService.meUser;
    }

    ngOnInit(): void{
        this.lockForm = this._formBuilder.group({
            username: [
                {
                    value   : 'Katherine',
                    disabled: true
                }, Validators.required
            ],
            password: ['', Validators.required]
        });
    }
    submit(): void {
        this.progressService.show();
        this.errorMessage = null;
        const authUser = new AuthData();
        authUser.email = this.meUser.email;
        authUser.password = this.lockForm.value.password;
        this.auth.login(authUser)
        .then(() => {
            this.progressService.hide();
            this.lockService.lockPage(false);
        })
        .catch((resp) => {
            this.progressService.hide();
            this.errorMessage = 'Incorrect Password';
        });
    }
    goSignIn(): void {
        setTimeout(() => {
            this.lockService.lockPage(false);
        }, 1000);
    }
    

}
