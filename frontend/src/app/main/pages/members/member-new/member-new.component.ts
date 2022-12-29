import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FuseProgressBarService} from '../../../../../@fuse/components/progress-bar/progress-bar.service';
import {Member} from '../../../../models/member';

@Component({
  selector: 'app-member-new',
  templateUrl: './member-new.component.html',
  styleUrls: ['./member-new.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MemberNewComponent implements OnInit {
    member: Member = new Member();
    newForm: FormGroup;
    submitted = false;
    constructor(
      private api: ApiService,
      private _snackBar: MatSnackBar,
      private _formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<MemberNewComponent>,
      private progressService: FuseProgressBarService,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        this.initializeForm();
    }
    
    initializeForm(): void {
        this.newForm = this._formBuilder.group({
            first_name   : [this.member.first_name, [Validators.required]],
            last_name   : [this.member.last_name, [Validators.required]],
            role   : [this.member.role, [Validators.required]],
            email   : [this.member.email, [Validators.required, Validators.email]],
        });
    }

    submitForm(): void {
        this.progressService.show();
        this.submitted = true;
        this.api.member.create(this.newForm.value).promise().then(resp => {
            this.submitted = false;
            this.progressService.hide();
            this._snackBar.open(`New Member ${this.newForm.value.first_name} created!`, 'Success', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.dialogRef.close({resp: resp});
        }).catch(error => {
            this.progressService.hide();
            this.submitted = false;
            this._snackBar.open('Member create failed', 'Failed', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
        });
    }
    
    cancel(): void {
        this.dialogRef.close();
    }

}

