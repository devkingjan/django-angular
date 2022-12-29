import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {RemoveOptionComponent} from '../remove-option/remove-option.component';
import {ApiService} from '../../../../@fuse/api/api.service';

@Component({
    selector: 'app-manage-options',
    templateUrl: './manage-options.component.html',
    styleUrls: ['./manage-options.component.scss']
})
export class ManageOptionsComponent implements OnInit {
    newForm: FormGroup;
    options = [];
    deletedOptions = [];
    column: any;
    from: string;
    
    constructor(
        private _formBuilder: FormBuilder,
        private dialog: MatDialog,
        private api: ApiService,
        private dialogRef: MatDialogRef<ManageOptionsComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.options = Object.assign([], data.column.options);
        this.column = data.column;
        this.from = data.from;
    }
    
    ngOnInit(): void {
    }
    
    addNew(): void {
        this.options.push({value: 'New Option', column: this.column.id, new: true});
    }
    
    removeOption(option): void {
        if (option.id) {
            const dialogRef = this.dialog.open(RemoveOptionComponent, {data: {name: option.value}});
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
        if (this.from === 'inventory') {
            this.api.inventory.createDropdownOption(this.column.id, request).promise().then(resp => {
                this.dialogRef.close({options: resp});
            });
        } else if (this.from === 'experiment') {
            this.api.experiment.createDropdownOption(this.column.id, request).promise().then(resp => {
                this.dialogRef.close({options: resp});
            });
        }
    }
    
}

