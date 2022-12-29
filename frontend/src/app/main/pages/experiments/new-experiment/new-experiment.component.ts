import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FuseProgressBarService} from "../../../../../@fuse/components/progress-bar/progress-bar.service";
import {ManageOptionsComponent} from "../../../components/manage-options/manage-options.component";

@Component({
    selector: 'app-new-experiment',
    templateUrl: './new-experiment.component.html',
    styleUrls: ['./new-experiment.component.scss']
})
export class NewExperimentComponent implements OnInit {
    expData: any;
    submitted = false;
    columns: any;
    templateId: any;
    databases: any[] = [];
    newForm: FormGroup;
    
    constructor(
        private progress: FuseProgressBarService,
        private api: ApiService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<NewExperimentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.expData = this.data.data;
        this.columns = this.data.columns;
        this.templateId = this.data.templateId;
        this.databases = this.data.databases;
        if (!this.templateId && this.databases.length) {
            this.templateId = this.databases[0].id;
        }
        const formConfig = {};
        if (this.expData) {
            this.columns.forEach(c => {
                const selectedColumn = this.expData.column_data.find(d => d.column === c.id);
                if (selectedColumn) {
                    formConfig[c.id] = [c.widget === 'dropdown' ? parseInt(selectedColumn.value, 10) : selectedColumn.value, c.default ? [Validators.required] : []];
                } else {
                    formConfig[c.id] = [null, c.default ? [Validators.required] : []];
                }
            });
        } else {
            this.columns.forEach(c => {
                formConfig[c.id] = [null, c.default ? [Validators.required] : []];
            });
        }
        this.newForm = this._formBuilder.group(formConfig);
    }
    
    ngOnInit(): void {
    }
    
    onSelectDatabase(): void {
        this.api.experiment.getColumns(this.templateId).promise().then(resp => {
            this.columns = resp;
            const formConfig = {};
            this.columns.forEach(c => {
                formConfig[c.id] = [null, c.default ? [Validators.required] : []];
            });
            this.newForm = this._formBuilder.group(formConfig);
        });
    }
    
    createOption(column): void {
        const dialogRef = this.dialog.open(ManageOptionsComponent, {data: {column: column, from: 'experiment'}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.options) {
                column.options = resp.options;
            }
        });
    }
    
    submit(): void {
        this.progress.show();
        this.submitted = true;
        if (this.expData) {
            this.api.experiment.editExpData(this.expData.id, this.newForm.value).promise().then(resp => {
                this._snackBar.open('Experiment Data is updated', 'create', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                });
                this.progress.hide();
                this.submitted = false;
                this.dialogRef.close({update: resp});
            });
        } else {
            this.api.experiment.createExpData(this.templateId, this.newForm.value).promise().then(resp => {
                this._snackBar.open('New Experiment Data is created', 'create', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                });
                this.progress.hide();
                this.submitted = false;
                this.dialogRef.close({create: resp, templateId: this.templateId});
            });
        }
    }
    
}
