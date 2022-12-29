import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {BehaviorSubject} from 'rxjs';
import {LabSectionData, LabSectionTableColumn} from '../../../models/lab-write';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-lab-write-section-table',
    templateUrl: './lab-write-section-table.component.html',
    styleUrls: ['./lab-write-section-table.component.scss']
})
export class LabWriteSectionTableComponent implements OnInit {
    @Input() index: number;
    @Input() data: LabSectionData;
    @Input() disabled: boolean;
    newForm: FormGroup;
    @Output('deleteSection') deleteSection: EventEmitter<any> = new EventEmitter();
    @Output('editSection') editSection: EventEmitter<any> = new EventEmitter();

    edit = false;

    dataSource: TableDataSource;

    _dataSubject = new BehaviorSubject<any[]>([]);

    displayedColumns: string [] = [];
    columns: LabSectionTableColumn [] = [];
    tableData: string [] = [];

    columnSliderValue = 5;
    rowSliderValue = 5;

    constructor(
        private _formBuilder: FormBuilder,
    ) {
        this.dataSource = new TableDataSource(this._dataSubject);
        this.newForm = this._formBuilder.group({
            columnSliderValue: [this.columnSliderValue],
            rowSliderValue: [this.rowSliderValue],
        });
    }

    ngOnInit(): void {
        if (this.data.column) {
            this.columnSliderValue = this.data.column;
            this.newForm.controls['columnSliderValue'].setValue(this.data.column);
        }
        if (this.data.row) {
            this.rowSliderValue = this.data.row;
            this.newForm.controls['rowSliderValue'].setValue(this.data.row);
        }
        this.updateTableData();
    }

    onEditSection(): void {
        this.edit = !this.edit;
    }

    onDeleteSection(): void {
        this.deleteSection.emit(this.index);
    }

    updateTableData(): void {
        this.displayedColumns = this.generateHeaders(this.columnSliderValue);
        this.columns = this.generateColumns(this.columnSliderValue);
        if (this.data.data) {
            this.tableData = JSON.parse(this.data.data);
        } else {
            this.tableData = this.generateData(this.columnSliderValue, this.rowSliderValue);
        }

        this._dataSubject.next(this.tableData);
    }

    generateHeaders(tableColumns: number): string[] {
        let innerIndex = 1;
        const displayedColumns = [];

        do {
            displayedColumns.push(innerIndex.toString());
        }
        while (innerIndex++ < tableColumns);

        return displayedColumns;
    }

    generateColumns(tableColumns: number): any[] {
        let innerIndex = 1;
        const columnObj = new LabSectionTableColumn();
        const columns = [];

        do {
            columnObj.columnDef = innerIndex.toString();
            columnObj.header = innerIndex.toString();
            columnObj.cell = [];
            columns.push(Object.assign({}, columnObj));
        }
        while (innerIndex++ < tableColumns);

        return columns;
    }

    generateData(tableColumns: number, tableRows: number): any[] {
        let innerIndex = 1;
        let outerIndex = 0;
        let tableRow = [];
        const tableData = [];

        do {
            innerIndex = 1;
            do {
                tableRow.push('');
            }
            while (innerIndex++ < tableColumns);

            tableData.push(tableRow);
            tableRow = [];
        }
        while (outerIndex++ < tableRows - 1);

        return tableData;
    }

    onChange(event, row: string, colIndex): void {
        this.tableData[row][colIndex] = event;
        this.data.data = JSON.stringify(this.tableData);
        this.editSection.emit({index: this.index, data: this.data});
    }

    onGenerateTable(): void {
        this.columnSliderValue = this.newForm.value.columnSliderValue;
        this.rowSliderValue = this.newForm.value.rowSliderValue;
        this.data.data = '';
        this.data.column = this.newForm.value.columnSliderValue;
        this.data.row = this.newForm.value.rowSliderValue;
        this.updateTableData();
    }
}

export class TableDataSource extends DataSource<any> {

    constructor(private _data: BehaviorSubject<any[]>) {
        super();
    }

    connect(): any {
        return this._data.asObservable();
    }

    disconnect(): void {
    }
}
