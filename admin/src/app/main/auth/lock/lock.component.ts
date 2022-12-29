import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { LockService } from '../../../../@fuse/services/lock.service';
import { User } from '../../../models/user';
import {AuthService} from '../../../../@fuse/services/auth.service';
import {AuthData} from '../../../models/auth-data';
import {MatSnackBar} from '@angular/material/snack-bar';

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
        private _snackBar: MatSnackBar
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
        this.errorMessage = null;
        const authUser = new AuthData();
        authUser.email = this.meUser.email;
        authUser.password = this.lockForm.value.password
        this.auth.login(authUser)
        .then(() => {
            this.lockService.lockPage(false);
        })
        .catch((resp) => {
            this.errorMessage = 'Incorrect Password';
        });
    }
    

}
