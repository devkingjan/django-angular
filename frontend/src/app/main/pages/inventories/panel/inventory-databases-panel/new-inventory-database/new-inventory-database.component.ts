import {Component, Inject, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../../../../../@fuse/api/api.service';
import {ConfirmDeletionComponent} from '../../../../experiments/new-database/confirm-deletion/confirm-deletion.component';
import {InventoryColumn} from '../../../../../../models/inventory-column';

@Component({
  selector: 'app-new-inventory-database',
  templateUrl: './new-inventory-database.component.html',
  styleUrls: ['./new-inventory-database.component.scss']
})
export class NewInventoryDatabaseComponent implements OnInit {
    isCustomDatabase = true;
    igorTemplates: any = [];
    templates: any = [];
    columns: InventoryColumn[];
    databaseName: string;
    dbForm: FormGroup;
    displayedColumns = ['name'];
    selectedTemplate: any;
    editTemplate = false;
    title = 'Create';
    deletedColumns = [];
    addShelf = false;
    decisionCheckList = [];
    constructor(
        private api: ApiService,
        private _snackBar: MatSnackBar,
        private _builder: FormBuilder,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<NewInventoryDatabaseComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.selectedTemplate = data.template;
        if (this.selectedTemplate) {
            this.isCustomDatabase = false;
        }
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
        const newColumn1 = new InventoryColumn();
        newColumn1.name = 'Name';
        newColumn1.widget = 'text';
        newColumn1.default = false;
        this.columns.push(newColumn1);
        const newColumn = new InventoryColumn();
        newColumn.name = 'Date';
        newColumn.widget = 'date';
        newColumn.default = false;
        this.columns.push(newColumn);
        this.addColumn('Temperature');
        this.addColumn('Equipment');
    }
    getDbTemplates(): void{
        this.api.inventory.getDatabase().promise().then(resp => {
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
        this.isCustomDatabase = false;
        this.selectedTemplate = val;
        this.dbForm.setValue({dbName: this.selectedTemplate.name});
        this.getColumns();
    }
    getColumns(): void {
        this.api.inventory.getColumns(this.selectedTemplate.id).promise().then(resp => {
           this.columns = resp;
           const filteredColumns = this.columns.filter(c => c.default === true);
           filteredColumns.forEach(c => {
               this.decisionCheckList.push(c.name);
           });
        });
    }
    columnDecision(val, column): void {
        this.decisionCheckList.push(column);
        if (this.decisionCheckList.length === 3) {
            this.isCustomDatabase = false;
        }
        if (val.answer) {
            this.addColumn(column);
        }
    }
    addColumn(column = null): void {
        const newColumn = new InventoryColumn();
        newColumn.name = column ? column : 'New Field';
        newColumn.widget = 'text';
        newColumn.default = column ? true : false;
        this.columns.push(newColumn);
    }
    deleteColumn(val): void {
        if (val.id) {
            const dialogRef =  this.dialog.open(ConfirmDeletionComponent, {data: {column: val.name, dbName: this.dbForm.value.dbName}});
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
        this.api.inventory.createDatabase(requestData).promise().then(resp => {
            this._snackBar.open('New Database is created0', 'success');
            this.templates.push(resp);
            this.reset();
            this.dialogRef.close({newDatabase: resp});
        });
    }
    customDatabase(): void {
        this.isCustomDatabase = true;
        this.reset();
        this.setDefaultColumn();
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
        this.api.inventory.editDatabase(requestData).promise().then(resp => {
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
        this.decisionCheckList = [];
    }
}

