import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MyErrorStateMatcher} from '../profile/change-password/change-password.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiService} from '../../../../@fuse/api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UtilsService} from '../../../../@fuse/services/utils.service';

@Component({
    selector: 'app-reset-pin',
    templateUrl: './reset-pin.component.html',
    styleUrls: ['./reset-pin.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ResetPinComponent implements OnInit {
    uid: string;
    token: string;
    errorMessage: string = null;
    resetPinForm: FormGroup;
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

    ngOnInit(): void {
        this.resetPinForm = this._formBuilder.group({
            new_pin: ['', [
                Validators.required,
                Validators.maxLength(6),
                Validators.pattern('^[0-9]*$'),
            ]],
            confirmPin: ['', Validators.required],
        }, {validator: this.checkPins});
    }

    checkPins(group: FormGroup): any {
        const pin = group.get('new_pin').value;
        const confirmPin = group.get('confirmPin').value;
        return pin === confirmPin ? null : { notSame: true };
    }
    submit(): void {
        this.errorMessage = null;
        const request = {
            uid: this.uid,
            token: this.token,
            new_pin: this.resetPinForm.value.new_pin
        };
        this.api.me.forgotPin(request).promise().then(resp => {
            this._snackBar.open('Pin reset successfully!', 'Success', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
            this.resetPinForm.reset();
            setTimeout(() => {
                this.router.navigate(['/pages/profile']);
            }, 3000);
        }).catch(resp => {
            this.errorMessage = this.utilsService.parseError(resp);
        });
    }

}
