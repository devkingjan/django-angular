import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {CellCultureLine} from '../../../models/cell-culture-line';
import {ApiService} from '../../../../@fuse/api/api.service';
import {CellCultureEventByDate} from '../../../models/cell-culture-event-by-date';
import {FuseProgressBarService} from "../../../../@fuse/components/progress-bar/progress-bar.service";

@Component({
    selector: 'app-cell-culture-history',
    templateUrl: './cell-culture-history.component.html',
    styleUrls: ['./cell-culture-history.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CellCultureHistoryComponent implements OnInit {
    cellCultureEventByDate: CellCultureEventByDate[] = [];
    originCellCultureEventByDate: CellCultureEventByDate[] = [];
    cellCultureLines: CellCultureLine[] = [];
    selectedCellLine: CellCultureLine = null;
    cellLinesByDate: any[] = [];
    filter: any;
    query: string = null;
    
    constructor(
        private progress: FuseProgressBarService,
        private api: ApiService
    ) {
    }
    
    ngOnInit(): void {
        this.getCellCultureLines();
    }
    
    getCellCultureLines(): void {
        this.api.cellCultureLine.getCellCultureLine().params({removed: false}).promise().then(resp => {
            this.cellCultureLines = resp;
        });
    }
    
    onSelectCellLine(filter): void {
        this.filter = filter;
        this.getHistory();
    }
    
    search(query): void {
        if (query) {
            this.query = query;
            this.filterData();
        } else {
            this.cellCultureEventByDate = Object.assign([], this.originCellCultureEventByDate);
        }
    }
    
    filterData(): void {
        const newData = [];
        for (const item of this.originCellCultureEventByDate) {
            const newItem = {};
            newItem['time'] = item['time'];
            newItem['cell_lines'] = [];
            newItem['events'] = [];
            for (const cellLine of item.cell_lines) {
                if (cellLine.name.toLowerCase().indexOf(this.query.toLowerCase()) !== -1 || cellLine.uid.toLowerCase().indexOf(this.query.toLowerCase()) !== -1) {
                    newItem['cell_lines'] = item.cell_lines;
                    break;
                }
            }
            for (const event of item.events) {
                if (event.cell_line.name.toLowerCase().indexOf(this.query.toLowerCase()) !== -1) {
                    newItem['events'].push(event);
                }
            }
            if (newItem['cell_lines'].length || newItem['events'].length) {
                newData.push(newItem);
            }
        }
        this.cellCultureEventByDate = Object.assign([], newData);
    }
    
    checkEqualName(): void {
    
    }
    
    getHistory(): void {
        this.progress.show();
        this.api.cellCultureLine.getCellCultureHistory().params(this.filter).promise().then(resp => {
            this.progress.hide();
            this.cellCultureEventByDate = resp;
            this.originCellCultureEventByDate = Object.assign([], resp);
        });
    }
    
    deleteHistory(history): void {
        if (history.log_type === 1) {
            this.cellCultureLines = this.cellCultureLines.filter(l => l.id !== history.cell_line.id);
        }
        this.getHistory();
    }
}
