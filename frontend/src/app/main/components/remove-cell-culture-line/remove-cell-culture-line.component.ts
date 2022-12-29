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
    selector: 'app-remove-cell-culture-line',
    templateUrl: './remove-cell-culture-line.component.html',
    styleUrls: ['./remove-cell-culture-line.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RemoveCellCultureLineComponent implements OnInit {
    
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
        public dialogRef: MatDialogRef<RemoveCellCultureLineComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.cellCultureLine = data.cellCultureLine;
        this.newForm = this._formBuilder.group({
            selected_date: ['', [Validators.required]],
            remove_reason: ['', []],
            reason_other: ['', []],
        });
    }
    
    ngOnInit(): void {
        this.newForm.valueChanges.subscribe(change => {
            if (change['log_type'] === 'remove_cell_line' && change['remove_reason'] !== 'other' && this.otherReason === 'other') {
                this.otherReason = change['remove_reason'];
                this.newForm.get('reason_other') ? this.newForm.get('reason_other').setValue(null) : console.log();
            }
            this.otherReason = change['remove_reason'];
        });
    }
    
    create(): void {
        this.newForm.value['log_type'] = 'remove_cell_line';
        this.newForm.value['cell_culture_line'] = this.cellCultureLine.id;
        this.newForm.value['created_at'] = new Date();
        this.newForm.value['updated_at'] = new Date();
        this.submitted = true;
        this.progress.show();
        this.api.cellCultureLine.createCellCultureEvent(this.newForm.value).promise().then(resp => {
            this.progress.hide();
            this.submitted = false;
            this.dialogRef.close({event: resp});
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
