import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ApiService} from '@fuse/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FuseProgressBarService} from '@fuse/components/progress-bar/progress-bar.service';
import {ErrorStateMatcher} from '@angular/material/core';

@Component({
  selector: 'app-change-pin',
  templateUrl: './change-pin.component.html',
  styleUrls: ['./change-pin.component.scss']
})
export class ChangePinComponent implements OnInit {
    changeForm: FormGroup;
    matcher = new MyErrorStateMatcher();
    constructor(
        private api: ApiService,
        private _snackBar: MatSnackBar,
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<ChangePinComponent>,
        private progressService: FuseProgressBarService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        this.changeForm = this._formBuilder.group({
            current_pin: ['', [Validators.required]],
            new_pin: ['', [
                Validators.required,
                Validators.maxLength(6),
                Validators.pattern('^[0-9]*$'),
            ]],
            confirmPin: ['', Validators.required],
        }, {validator: this.checkPasswords});
    }
    checkPasswords(group: FormGroup): any {
        const pin = group.get('new_pin').value;
        const confirmPin = group.get('confirmPin').value;
        return pin === confirmPin ? null : { notSame: true };
    }

    submit(): void {
        this.progressService.show();
        this.api.me.resetPin(this.changeForm.value).promise().then(resp => {
            this.progressService.hide();
            this._snackBar.open('Pin reset successfully!', 'Success', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
            this.dialogRef.close();
        }).catch(resp => {
            this.progressService.hide();
            let errorMessages = null;
            if ('current_pin' in resp.error) {
                errorMessages = resp.error['current_pin'];
            } else if ('new_pin' in resp.error) {
                errorMessages = resp.error['new_pin'];
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

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
        const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

        return (invalidCtrl || invalidParent);
    }
}
