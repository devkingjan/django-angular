import {Component, Inject, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Column} from '../../../../models/column';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDeletionComponent} from './confirm-deletion/confirm-deletion.component';
import {InventoryColumn} from "../../../../models/inventory-column";

@Component({
    selector: 'app-new-database',
    templateUrl: './new-database.component.html',
    styleUrls: ['./new-database.component.scss']
})
export class NewDatabaseComponent implements OnInit {
    igorTemplates: any = [];
    templates: any = [];
    columns: Column[];
    databaseName: string;
    dbForm: FormGroup;
    displayedColumns = ['name'];
    selectedTemplate: any;
    editTemplate = false;
    title = 'Create';
    deletedColumns = [];
    
    constructor(
        private api: ApiService,
        private _snackBar: MatSnackBar,
        private _builder: FormBuilder,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<NewDatabaseComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.selectedTemplate = data.template;
        this.dbForm = this._builder.group({
            dbName: ['', [Validators.required]]
        });
    }
    
    ngOnInit(): void {
        this.init();
        this.getDbTemplates();
    }
    
    init(): void {
        this.columns = [];
        if (this.selectedTemplate) {
            this.title = 'Update';
            this.editTemplate = true;
            this.dbForm.setValue({dbName: this.selectedTemplate.name});
            this.getColumns();
        } else {
            this.setDefaultColumn();
        }
    }
    
    setDefaultColumn(): void {
        const newColumn1 = new Column();
        newColumn1.name = 'Title';
        newColumn1.widget = 'text';
        newColumn1.default = true;
        this.columns.push(newColumn1);
        const newColumn = new Column();
        newColumn.name = 'Date';
        newColumn.widget = 'date';
        newColumn.default = true;
        this.columns.push(newColumn);
        const newColumn2 = new Column();
        newColumn2.name = 'Experiment Type';
        newColumn2.widget = 'dropdown';
        newColumn2.default = true;
        this.columns.push(newColumn2);
        
    }
    
    getDbTemplates(): void {
        this.api.experiment.getDbTemplates().promise().then(resp => {
            this.templates = resp;
        });
    }
    
    drop(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    }
    
    onSelect(val): void {
        if (this.selectedTemplate && this.selectedTemplate.id === val.id) {
            return;
        }
        this.selectedTemplate = val;
        this.dbForm.setValue({dbName: this.selectedTemplate.name});
        this.getColumns();
    }
    
    getColumns(): void {
        this.api.experiment.getColumns(this.selectedTemplate.id).promise().then(resp => {
            this.columns = resp;
        });
    }
    
    addColumn(): void {
        const newColumn = new Column();
        newColumn.name = 'Name';
        newColumn.widget = 'text';
        this.columns.push(newColumn);
    }
    
    deleteColumn(val): void {
        if (val.id) {
            const dialogRef = this.dialog.open(ConfirmDeletionComponent, {
                data: {
                    column: val.name,
                    dbName: this.dbForm.value.dbName
                }
            });
            dialogRef.afterClosed();
            dialogRef.afterClosed().subscribe(result => {
                if (result && result.confirm) {
                    console.log(result.confirm);
                    this.deletedColumns.push(val.id);
                    this.columns = this.columns.filter(c => c.id !== val.id);
                }
            });
        } else {
            this.columns = this.columns.filter(c => c !== val);
        }
    }
    
    onSelectWidget(val): void {
        console.log(val);
    }
    
    createDatabase(): void {
        if (this.checkSameName()) {
            this._snackBar.open('Same name exist, Please check again', 'warning');
            return;
        }
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].order = i;
        }
        const requestData = {
            name: this.dbForm.value.dbName,
            columns: this.columns
        };
        this.api.experiment.createTemplate(requestData).promise().then(resp => {
            this._snackBar.open('New Database is created0', 'success');
            this.templates.push(resp);
            this.reset();
            this.dialogRef.close({newTemplate: resp});
        });
    }
    
    editDatabase(): void {
        if (this.checkSameName()) {
            this._snackBar.open('Same name exist, Please check again', 'warning');
            return;
        }
        for (let i = 0; i < this.columns.length; i++) {
            this.columns[i].order = i;
        }
        this.selectedTemplate.name = this.dbForm.value.dbName;
        const requestData = {
            template: this.selectedTemplate,
            columns: this.columns,
            deletedColumns: this.deletedColumns
        };
        this.api.experiment.editTemplate(requestData).promise().then(resp => {
            this._snackBar.open('Database is updated', 'success');
            this.reset();
            this.dialogRef.close({updated: resp});
        });
    }
    
    checkSameName(): boolean {
        const existNames = [];
        for (const column of this.columns) {
            if (existNames.indexOf(column.name) !== -1) {
                return true;
                break;
            } else {
                existNames.push(column.name);
            }
        }
        return false;
    }
    
    reset(): void {
        this.dbForm.reset();
        this.columns = [];
        this.setDefaultColumn();
    }
}
