import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CellCultureLine} from "../../../models/cell-culture-line";
import {from} from "rxjs";
import {UtilsService} from "../../../../@fuse/services/utils.service";

@Component({
    selector: 'app-cell-culture-history-navigate-panel',
    templateUrl: './cell-culture-history-navigate-panel.component.html',
    styleUrls: ['./cell-culture-history-navigate-panel.component.scss']
})
export class CellCultureHistoryNavigatePanelComponent implements OnInit, OnChanges {
    fromDate: any;
    toDate: any;
    selectedCellLine: any = '-1';
    originCellLines: CellCultureLine[] = [];
    filteredCellLines: CellCultureLine[] = [];
    searchQuery: string = null;
    @Input() cellCultureLines: CellCultureLine[];
    @Output() selected = new EventEmitter();
    @Output() searchEvent = new EventEmitter();
    
    constructor(
        private util: UtilsService
    ) {
    }
    
    ngOnInit(): void {
        this.initialize();
        this.emitFilter();
    }
    
    initialize(): void {
        this.fromDate = new Date('Sep 1,2020');
        this.toDate = this.util.getStatTime(new Date());
    }
    
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.cellCultureLines) {
            this.originCellLines = Object.assign([], changes.cellCultureLines.currentValue);
            this.filteredCellLines = Object.assign([], this.originCellLines);
            if (!this.selectedCellLine && this.filteredCellLines.length) {
                this.selectedCellLine = this.filteredCellLines[0];
            }
        }
    }
    
    checkEmpty(): void {
        if (!this.searchQuery) {
            this.searchEvent.emit(this.searchQuery);
        }
    }
    
    search(): void {
        this.searchEvent.emit(this.searchQuery);
    }
    
    emitFilter(): void {
        let cellLine = null;
        if (this.selectedCellLine === '-1') {
            cellLine = '-1';
        } else {
            cellLine = this.selectedCellLine.id;
        }
        let fromDate, toDate;
        if (this.fromDate) {
            fromDate = this.fromDate;
        } else {
            fromDate = new Date('Sep 1,2020');
        }
        
        if (this.toDate) {
            toDate = this.toDate;
        } else {
            toDate = new Date();
        }
        console.log(fromDate.toISOString(), "from date~~~~~~");
        console.log(toDate.toISOString(), "to date~~~~~~");
        const filter = {
            cell_line: cellLine,
            from_date: fromDate.toISOString(),
            to_date: toDate.toISOString()
        };
        this.selected.emit(filter);
    }
    
}
