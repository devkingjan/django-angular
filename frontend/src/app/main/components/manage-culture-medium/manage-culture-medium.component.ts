import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {RemoveOptionComponent} from '../remove-option/remove-option.component';
import {ApiService} from '../../../../@fuse/api/api.service';

@Component({
  selector: 'app-manage-culture-medium',
  templateUrl: './manage-culture-medium.component.html',
  styleUrls: ['./manage-culture-medium.component.scss']
})
export class ManageCultureMediumComponent implements OnInit {
    newForm: FormGroup;
    options = [];
    deletedOptions = [];
    cellCultureLineId: any;
    field: string;
    constructor(
        private _formBuilder: FormBuilder,
        private dialog: MatDialog,
        private api: ApiService,
        private dialogRef: MatDialogRef<ManageCultureMediumComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.options = Object.assign([], data.options);
        this.cellCultureLineId = data.cellCultureLineId;
        this.field = data.field;
    }
    
    ngOnInit(): void {
    }
    addNew(): void {
        this.options.push({name: 'New Option', new: true, field: this.field});
    }
    removeOption(option): void {
        if (option.id) {
            const dialogRef = this.dialog.open(RemoveOptionComponent, {data: {name: option.name}});
            dialogRef.afterClosed().subscribe(resp => {
                if (resp && resp.confirm) {
                    this.options = this.options.filter(o => o !== option);
                    this.deletedOptions.push(option.id);
                }
            });
        } else {
            this.options = this.options.filter(o => o !== option);
        }
    }
    close(): void {
        this.dialogRef.close();
    }
    submit(): void {
        const request = {
            deleted_options: this.deletedOptions,
            options: this.options
        };
        this.api.cellCultureLine.createCellCultureLineOptions(request).promise().then(resp => {
            this.dialogRef.close({options: resp});
        });
    }

}

