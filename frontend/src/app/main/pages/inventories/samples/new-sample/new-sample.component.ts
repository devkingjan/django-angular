import {Component, Inject, Input, OnInit} from '@angular/core';
import {Form, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../../../../@fuse/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatStepper} from '@angular/material/stepper';
import {FuseProgressBarService} from '../../../../../../@fuse/components/progress-bar/progress-bar.service';
import {UtilsService} from '../../../../../../@fuse/services/utils.service';

@Component({
  selector: 'app-new-sample',
  templateUrl: './new-sample.component.html',
  styleUrls: ['./new-sample.component.scss']
})
export class NewSampleComponent implements OnInit {
    databaseId: any;
    sampleData: any = {};
    columns: any = [];
    columnsWithoutDefault: any = [];
    storageTemperatures: any = [];
    sampleDataForm: FormGroup;
    vialForm: FormGroup;
    multiVialsForm: FormGroup;
    submitted = false;
    constructor(
        private progress: FuseProgressBarService,
        private api: ApiService,
        private _snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<NewSampleComponent>,
        private utilsService: UtilsService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.sampleData = this.data.data;
        this.columns = this.data.columns;
        this.columnsWithoutDefault = this.columns.filter(c => c.default === false);
        this.databaseId = this.data.databaseId;
    }
    ngOnInit(): void {
        this.getStorageTemperature();
    }
    getStorageTemperature(): void {
        const filter = {
            database: this.databaseId,
        };
        this.api.storageLocation.getStorageTemperatures().filter(filter).promise().then(resp => {
           this.storageTemperatures = resp;
        });
    }
    onNext(val: any, stepper: MatStepper): void {
        this.sampleDataForm = val;
        stepper.next();
    }
    onMultiVialPanel(val: any, stepper: MatStepper): void {
        stepper.next();
    }
    submitSingleVial(val): void {
        this.vialForm = val;
        const request = {
            sample_data: this.sampleDataForm.value,
            locations: [
                this.vialForm.value
            ]
        };
        this.submitData(request);
    }
    submitMultiVials(val): void {
        this.multiVialsForm = val.form;
        const vialNumber = val.vialNumber;
        const locations = [];
        for (let i = 0 ; i < vialNumber; i++) {
            const id = this.multiVialsForm.value[`allocate_number${i}`];
            const position = this.multiVialsForm.value[`position${i}`];
            locations.push({id, position});
        }
        const request = {
            sample_data: this.sampleDataForm.value,
            locations
        };
        this.submitData(request);
    }
    submitData(data): void{
        this.submitted = true;
        this.progress.show();
        if (this.sampleData) {
            this.api.inventory.editSampleData(this.sampleData.id, this.sampleData.location.sample_location_id, data).promise().then(resp => {
                this.submitted = false;
                this.progress.hide();
                this.dialogRef.close({update: resp});
                this._snackBar.open('New samples updated successfully', 'Success', {
                  duration: 3000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                });
            }).catch(error => {
                this.submitted = false;
                this.progress.hide();
                const errorMessage = this.utilsService.parseError(error);
                this._snackBar.open(errorMessage, 'Failed', {
                  duration: 3000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                });
            });;
        } else {
            this.api.inventory.createSampleData(this.databaseId, data).promise().then(resp => {
                this.submitted = false;
                this.progress.hide();
                this.dialogRef.close({create: resp});
                this._snackBar.open('New samples created successfully', 'Success', {
                  duration: 3000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                });
            }).catch(error => {
                this.submitted = false;
                this.progress.hide();
                const errorMessage = this.utilsService.parseError(error);
                this._snackBar.open(errorMessage, 'Failed', {
                  duration: 3000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                });
            });
        }
        
    }

}
