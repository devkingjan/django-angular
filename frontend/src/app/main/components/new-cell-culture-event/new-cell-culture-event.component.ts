import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../@fuse/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CellCultureEvent} from '../../../models/cell-culture-event';
import {fuseAnimations} from '../../../../@fuse/animations';
import {CellCultureLine} from '../../../models/cell-culture-line';
import {FuseProgressBarService} from '../../../../@fuse/components/progress-bar/progress-bar.service';
import {UtilsService} from '../../../../@fuse/services/utils.service';

@Component({
    selector: 'app-new-cell-culture-event',
    templateUrl: './new-cell-culture-event.component.html',
    styleUrls: ['./new-cell-culture-event.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewCellCultureEventComponent implements OnInit {
    newForm: FormGroup;
    cellCultureLine: CellCultureLine;
    cellCultureEvent: CellCultureEvent;
    submitted = false;
    logType = null;
    otherReason = null;
    
    constructor(
        private api: ApiService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private dialog: MatDialog,
        private util: UtilsService,
        private progress: FuseProgressBarService,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<NewCellCultureEventComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.cellCultureLine = data.cellCultureLine;
        this.newForm = this._formBuilder.group({
            selected_date: ['', [Validators.required]],
            log_type: ['', [Validators.required]],
            remove_reason: ['', []],
            note: ['', []],
            mycoplasma_type: ['', []],
            medium_additive_text: ['', []],
            reason_other: ['', []],
        });
    }
    
    ngOnInit(): void {
        this.newForm.valueChanges.subscribe(change => {
            
            if (this.newForm.value['selected_date'] && this.newForm.value['selected_date'] > new Date()) {
                this.newForm.get('selected_date').setValue(null);
                this.snackBar.open('You can only log events in the past or for the present day', 'warning', {duration: 3000});
            }
            if (this.logType !== change['log_type']) {
                this.logType = change['log_type'];
                this.newForm.get('reason_other') ? this.newForm.get('reason_other').setValue(null) : console.log();
                this.newForm.get('remove_reason') ? this.newForm.get('remove_reason').setValue(null) : console.log();
                this.newForm.get('note') ? this.newForm.get('note').setValue(null) : console.log();
                this.newForm.get('mycoplasma_type') ? this.newForm.get('mycoplasma_type').setValue(null) : console.log();
                this.newForm.get('medium_additive_text') ? this.newForm.get('medium_additive_text').setValue(null) : console.log();
            }
            if (change['log_type'] === 'remove_cell_line' && change['remove_reason'] !== 'other' && this.otherReason === 'other') {
                this.otherReason = change['remove_reason'];
                this.newForm.get('reason_other') ? this.newForm.get('reason_other').setValue(null) : console.log();
            }
            this.otherReason = change['remove_reason'];
        });
    }
    
    create(): void {
        this.newForm.value['cell_culture_line'] = this.cellCultureLine.id;
        this.newForm.value['updated_at'] = new Date();
        this.submitted = true;
        this.progress.show();
        this.api.cellCultureLine.createCellCultureEvent(this.newForm.value).promise().then(resp => {
            this.progress.hide();
            this.submitted = false;
            this.dialogRef.close({event: resp['event'], cell: resp['cell']});
        }).catch(e => {
            this.progress.hide();
            this.submitted = false;
            const errorMsg = this.util.parseError(e);
            this._snackBar.open(errorMsg, 'Failed', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
        });
    }
}
