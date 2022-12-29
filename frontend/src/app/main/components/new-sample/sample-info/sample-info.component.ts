import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ManageOptionsComponent} from '../../manage-options/manage-options.component';

@Component({
  selector: 'app-sample-info',
  templateUrl: './sample-info.component.html',
  styleUrls: ['./sample-info.component.scss']
})
export class SampleInfoComponent implements OnInit, OnChanges {
    @Input() sampleData: any;
    @Input() columns: any;
    @Output() next = new EventEmitter();
    newForm: FormGroup;
    constructor(
        private _formBuilder: FormBuilder,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private api: ApiService,
    ) {
        // this.initializeForm();
        this.newForm = this._formBuilder.group({});
    }
    ngOnInit(): void {
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.initializeForm();
    }
    initializeForm(): void {
        const formConfig = {};
        if (this.sampleData) {
            this.columns.forEach(c => {
                const selectedColumn = this.sampleData.column_data.find(d => d.column === c.id);
                if (selectedColumn) {
                    formConfig[c.id] = [c.widget === 'dropdown' ? parseInt(selectedColumn.value, 10) : selectedColumn.value, [Validators.required]];
                } else {
                    formConfig[c.id] = [null, [Validators.required]];
                }
            });
        } else {
            this.columns.forEach(c => {
                formConfig[c.id] = [null, [Validators.required]];
            });
        }
        this.newForm = this._formBuilder.group(formConfig);
    }
    createOption(column): void {
        const dialogRef = this.dialog.open(ManageOptionsComponent, {data: {column: column, from: 'inventory'}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.options) {
                column.options = resp.options;
            }
        });
    }
    submit(): void {
        this.next.emit(this.newForm);
    }
}
