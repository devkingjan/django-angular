import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../@fuse/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from '../../../models/user';
import {CellCultureLine} from '../../../models/cell-culture-line';
import {ManageCultureMediumComponent} from '../manage-culture-medium/manage-culture-medium.component';
import {fuseAnimations} from '../../../../@fuse/animations';
import {FuseProgressBarService} from "../../../../@fuse/components/progress-bar/progress-bar.service";
import {UtilsService} from "../../../../@fuse/services/utils.service";

@Component({
    selector: 'app-new-cell-culture-line',
    templateUrl: './new-cell-culture-line.component.html',
    styleUrls: ['./new-cell-culture-line.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewCellCultureLineComponent implements OnInit {
    user: User;
    newForm: FormGroup;
    isToday = false;
    isTomorrow = false;
    cellCultureLine: CellCultureLine;
    cloneCellLines: CellCultureLine[];
    cloneCellLinesFromLastWeek: CellCultureLine[] = [];
    
    selectedDate: any = null;
    dueDate: any = null;
    submitted = false;
    columnMediums: any[] = [];
    columnOptions: any[] = [];
    howStarted = null;
    
    constructor(
        private api: ApiService,
        private progress: FuseProgressBarService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private util: UtilsService,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<NewCellCultureLineComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.cellCultureLine = this.data.cellCultureLine;
        this.cloneCellLines = this.data.cloneCellLines;
        if (this.cellCultureLine) {
            this.newForm = this._formBuilder.group({
                name: [this.cellCultureLine.name, [Validators.required]],
                origin: [this.cellCultureLine.origin, []],
                generic_modification: [this.cellCultureLine.generic_modification, []],
                how_started: [this.cellCultureLine.how_started, []],
                received_scientist: [this.cellCultureLine.received_scientist, []],
                cloned_cell_line: [this.cellCultureLine.cloned_cell_line, []],
                date_taken: [this.cellCultureLine.date_taken, [Validators.required]],
                passage_number: [this.cellCultureLine.passage_number, [Validators.required]],
                culture_medium: [this.cellCultureLine.culture_medium, []],
                medium_additive: [this.cellCultureLine.medium_additive, []],
                mycoplasmas_state: [this.cellCultureLine.mycoplasmas_state, []],
                culture_property: [this.cellCultureLine.culture_property, []],
                note: [this.cellCultureLine.note, []],
            });
        } else {
            this.newForm = this._formBuilder.group({
                name: ['', [Validators.required]],
                origin: ['', []],
                generic_modification: ['', []],
                how_started: ['', []],
                received_scientist: ['',],
                cloned_cell_line: ['',],
                date_taken: ['', [Validators.required]],
                passage_number: ['', [Validators.required]],
                culture_medium: ['', []],
                medium_additive: ['', []],
                mycoplasmas_state: ['', []],
                culture_property: ['', []],
                note: ['', []],
            });
        }
    }
    
    ngOnInit(): void {
        this.getOptions();
        this.subscribeForm();
        this.getCellCultureLines();
    }
    
    getCellCultureLines(): void {
        this.cloneCellLinesFromLastWeek = [];
        this.api.cellCultureLine.getCellCultureLine().params({from_date: 7}).promise().then(resp => {
            this.cloneCellLinesFromLastWeek = resp;
        });
    }
    
    subscribeForm(): void {
        this.newForm.valueChanges.subscribe(change => {
            if (this.howStarted !== change['how_started']) {
                this.howStarted = change['how_started'];
                if (this.howStarted !== 'received') {
                    this.newForm.get('received_scientist') ? this.newForm.get('received_scientist').setValue(null) : console.log();
                }
                if (this.howStarted !== 'cloned') {
                    this.newForm.get('cloned_cell_line') ? this.newForm.get('cloned_cell_line').setValue(null) : console.log();
                }
            }
        });
    }
    
    getOptions(): void {
        this.api.cellCultureLine.getCellCultureLineOptions().promise().then(resp => {
            this.columnMediums = resp.filter(c => c.field === 'medium');
            this.columnOptions = resp.filter(c => c.field === 'property');
        });
    }
    
    createOption(field): void {
        const dialogRef = this.dialog.open(ManageCultureMediumComponent,
            {
                data: {
                    options: field === 'medium' ? this.columnMediums : this.columnOptions,
                    cellCultureLineId: this.cellCultureLine ? this.cellCultureLine.id : null,
                    field
                }
            });
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.options) {
                this.columnMediums = resp.options.filter(c => c.field === 'medium');
                this.columnOptions = resp.options.filter(c => c.field === 'property');
            }
        });
    }
    
    create(): void {
        this.submitted = true;
        this.progress.show();
        this.newForm.value['updated_at'] = this.util.getStatTime(new Date());
        if (this.cellCultureLine) {
            this.newForm.value['id'] = this.cellCultureLine.id;
            this.api.cellCultureLine.editCellCultureLine(this.newForm.value).promise().then(resp => {
                this.dialogRef.close({cellCultureLine: resp});
                this.submitted = false;
                this.progress.hide();
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
            ;
        } else {
            this.api.cellCultureLine.createCellCultureLine(this.newForm.value).promise().then(resp => {
                this.dialogRef.close({cellCultureLine: resp});
                this.submitted = false;
                this.progress.hide();
            });
        }
    }
}

