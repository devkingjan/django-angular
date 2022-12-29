import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Column} from '../../../../models/column';

@Component({
  selector: 'app-experiment-filter',
  templateUrl: './experiment-filter.component.html',
  styleUrls: ['./experiment-filter.component.scss']
})
export class ExperimentFilterComponent implements OnInit {
    column: Column;
    sortMode: string = null;
    filterMode = 'equal';
    searchText: string = null;
    filterDate: any = null;
    filterModes = [
        {
            key: 'equal',
            value: 'Equal'
        },
        {
            key: 'does_not_equal',
            value: 'Does Not Equal'
        },
        {
            key: 'begins_with',
            value: 'Begins With'
        },
        {
            key: 'does_not_begins_with',
            value: 'Does Not Begins With'
        },
        {
            key: 'end_with',
            value: 'End With'
        },
        {
            key: 'does_not_end_with',
            value: 'Does Not End With'
        },
        {
            key: 'contains',
            value: 'Contains'
        },
        {
            key: 'does_not_contain',
            value: 'Does Not Contain'
        },
    ];
    constructor(
        public dialogRef: MatDialogRef<ExperimentFilterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.column = data.column;
        if (this.column.widget === 'dropdown') {
            this.filterMode = 'equal';
        }
    }
    
    ngOnInit(): void {
    }
    
    onSelectSortMode(mode): void {
        this.sortMode = this.sortMode === mode ? null : mode;
    }
    
    applyFilter(): void {
        const filter = {
            sortMode: this.sortMode,
            filterMode: this.filterMode,
            searchText: this.searchText,
            filterDate: this.filterDate
        };
        console.log(filter)
        this.dialogRef.close({filter: filter});
    }
    clearFilter(): void {
        this.sortMode = null;
        this.filterMode = 'equal';
        this.searchText = null;
        this.filterDate = null;
    }

}
