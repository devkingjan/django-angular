import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LabESign} from 'app/models/lab-write';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../../@fuse/api/api.service';

@Component({
    selector: 'app-lab-write-e-sign',
    templateUrl: './lab-write-e-sign.component.html',
    styleUrls: ['./lab-write-e-sign.component.scss']
})
export class LabWriteESignComponent implements OnInit {
    newForm: FormGroup;
    labESign: LabESign;
    submitted = false;

    constructor(
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<LabWriteESignComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private api: ApiService,
    ) {
        this.labESign = this.data.eSignVal;
        this.newForm = this._formBuilder.group({
            typeInitials: [this.labESign.typeInitials, [Validators.required]],
            password: [this.labESign.password, [Validators.required]],
        });
    }

    ngOnInit(): void {
    }

    onSign(): void {
        this.labESign.typeInitials = this.newForm.value.typeInitials;
        this.labESign.password = this.newForm.value.password;
        this.api.experiment.signExperiment(this.labESign).promise()
            .then(resp => {
                this.dialogRef.close({detail: resp.detail, error: false});
            })
            .catch(e => {
                this.dialogRef.close({detail: e.error.detail, error: false});
            });
    }
    isActive(event): void {
        this.submitted = event.checked;
    }

}
