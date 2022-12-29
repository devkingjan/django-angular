import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {fuseAnimations} from '../../../../../@fuse/animations';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {NewSampleComponent} from './new-sample/new-sample.component';
import {DoubleConfirmComponent} from '../../../components/double-confirm/double-confirm.component';
import {ExperimentFilterComponent} from '../../experiments/experiment-filter/experiment-filter.component';
import {NewInventoryDatabaseComponent} from '../panel/inventory-databases-panel/new-inventory-database/new-inventory-database.component';

@Component({
  selector: 'app-samples',
  templateUrl: './samples.component.html',
  styleUrls: ['./samples.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class SamplesComponent implements OnInit {
    selectedDatabaseId: any = null;
    databaseId: number;
    mode: string;
    columns: any;
    samples: any = [];
    headerItemFlex: any;
    databases: any = [];
    filterColumnName = '';
    filter = {
        column: null,
        sortMode: null,
        searchText: null,
        filterMode: null,
        filterDate: null
    };
    filterModes = {
        equal: 'Equal',
        does_not_equal: 'Does Not Equal',
        begins_with: 'Begins With',
        does_not_begins_with: 'Does Not Begins With',
        end_with: 'End With',
        does_not_end_with: 'Does Not End With',
        contains: 'Contains',
        does_not_contain: 'Does Not Contain'
    };
    expCount = 100;
    pageSize = 10;
    currentPageIndex = 0;
    pageSizeOptions: number[] = [10, 20, 30, 50, 100];
    selectedTemperature = false;
    selectedEquipment = false;
    constructor(
      private route: ActivatedRoute,
      private api: ApiService,
      private dialog: MatDialog
    ) {
        this.databaseId = parseInt(this.route.snapshot.paramMap.get('id'), 10) || null;
        this.selectedDatabaseId = this.databaseId;
        this.mode = this.route.snapshot.paramMap.get('mode');
    }
    ngOnInit(): void {
        this.getSampleData();
        this.getInventoryDatabases();
    }
    getSampleData(): void {
        this.api.inventory.getSampleData(this.databaseId).filter(this.filter).per_page(this.pageSize)
            .page(this.currentPageIndex).promise().then(resp => {
            this.columns = resp.columns;
            this.samples = resp.sample_data;
            this.expCount = resp.count;
            this.checkItemFlex();
        });
    }
    getInventoryDatabases(): void{
        this.api.inventory.getDatabase().promise().then(resp => {
            this.databases = resp;
        });
    }
    checkItemFlex(): void {
        if (this.columns.length > 6) {
            this.headerItemFlex = '200px';
        } else {
            this.headerItemFlex = `${Math.floor(100 / this.columns.length)}`;
        }
    }
    submitFilterOpen(val): void {
        const dialogRef = this.dialog.open(ExperimentFilterComponent, {data: {column: val}});
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.filter) {
                this.selectedTemperature = false;
                this.selectedEquipment = false;
                this.filterColumnName = val.name;
                let columnName = val.id;
                if (val.default) {
                    columnName = this.columns.find(c => c.id === val.id).name;
                }
                this.filter = {
                    default: val.default,
                    column: columnName,
                    ...result.filter
                };
                this.getSampleData();
            }
        });
    }
    submitLocationFilterOpen(val): void {
        const dialogRef = this.dialog.open(ExperimentFilterComponent, {data: {column: {widget: 'text'}}});
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.filter) {
                if (val === 'Temperature') {
                    this.selectedTemperature = true;
                } else {
                    this.selectedTemperature = false;
                }
                if (val === 'Equipment') {
                    this.selectedEquipment = true;
                } else {
                    this.selectedEquipment = false;
                }
                this.filter = {
                    column: val,
                    default: true,
                    ...result.filter
                };
                this.getSampleData();
            }
        });
    }
    createNewSample(val = null): void {
        const dialogRef = this.dialog.open(NewSampleComponent,
            {data: {columns: this.columns, databaseId: this.databaseId, data: val}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.create) {
                this.samples = resp.create.concat(this.samples);
            }
            if (resp && resp.update) {
                const updatedDataIndex = this.samples.findIndex(d => d.id === resp.update.id);
                this.samples[updatedDataIndex] = resp.update;
            }
        });
    }
    closeSample(val): void {
        const dialogRef = this.dialog.open(DoubleConfirmComponent,
            {data: {dataObj: val, description: `You are about to cancel experiment ${val.uid}.`}});
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.api.inventory.cancelSampleData(result.id).promise().then(resp => {
                    const updatedDataIndex = this.samples.findIndex(d => d.id === result.id);
                    this.samples[updatedDataIndex] = resp;
                });
            }
        });
    }
    updatedPage(e): void {
        this.currentPageIndex = e.pageIndex;
        this.pageSize = e.pageSize;
        this.getSampleData();
    }
    resetFilter(): void {
        this.filter = {
            column: null,
            sortMode: null,
            searchText: null,
            filterMode: null,
            filterDate: null
        };
        this.selectedTemperature = false;
        this.selectedEquipment = false;
        this.getSampleData();
    }
    onSelectDatabase(): void{
        this.databaseId = this.selectedDatabaseId;
        this.getSampleData();
    }
    editDatabase(): void {
        const selectedDatabase = this.databases.find(d => d.id === this.selectedDatabaseId);
        const dialogRef = this.dialog.open(NewInventoryDatabaseComponent, {data: {template: selectedDatabase}});
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.updated) {
              this.getSampleData();
          }
        });
    }
}
