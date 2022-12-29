import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../@fuse/api/api.service';

@Component({
    selector: 'app-assign-team',
    templateUrl: './assign-team.component.html',
    styleUrls: ['./assign-team.component.scss']
})
export class AssignTeamComponent implements OnInit {
    newForm: FormGroup;
    assignedUser = '';
    members: any[];

    constructor(
        public dialogRef: MatDialogRef<AssignTeamComponent>,
        @Inject(MAT_DIALOG_DATA) public data: number,
        private _formBuilder: FormBuilder,
        private api: ApiService,
    ) {
        this.newForm = this._formBuilder.group({
            assignedUser: [this.assignedUser, [Validators.required]],
        });
    }

    ngOnInit(): void {
        this.api.member.get().params({team: true}).promise().then(resp => {
            this.members = resp;
        });
    }

    onAssign(): void {
        this.assignedUser = this.newForm.value.assignedUser;
        this.api.experiment.assignExperiment(this.data, {assigned_user: this.assignedUser}).promise()
            .then(resp => {
                this.dialogRef.close({detail: resp.detail});
            });
    }

}
