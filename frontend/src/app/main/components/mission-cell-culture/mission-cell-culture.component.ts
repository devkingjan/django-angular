import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {ApiService} from '../../../../@fuse/api/api.service';
import {MatDialog} from '@angular/material/dialog';
import {CalendarService} from '../../pages/calendar/calendar.service';
import {fuseAnimations} from '../../../../@fuse/animations';
import {NewCellCultureLineComponent} from '../new-cell-culture-line/new-cell-culture-line.component';
import {CellCultureLine} from '../../../models/cell-culture-line';
import {NewCellCultureEventComponent} from '../new-cell-culture-event/new-cell-culture-event.component';
import {RemoveCellCultureLineComponent} from '../remove-cell-culture-line/remove-cell-culture-line.component';


@Component({
    selector: 'app-mission-cell-culture',
    templateUrl: './mission-cell-culture.component.html',
    styleUrls: ['./mission-cell-culture.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MissionCellCultureComponent implements OnInit {
    cellCultureLines: CellCultureLine[] = [];
    panelOpenState = false;
    expanded = true;
    dialogRef: any;
    
    @ViewChild(MatAccordion) accordion: MatAccordion;
    
    constructor(
        private api: ApiService,
        private dialog: MatDialog,
        private _matDialog: MatDialog,
        private _calendarService: CalendarService,
    ) {
    }
    
    ngOnInit(): void {
        this.getCellCultureLines();
    }
    
    getCellCultureLines(): void {
        this.cellCultureLines = [];
        this.api.cellCultureLine.getCellCultureLine().params({removed: false}).promise().then(resp => {
            this.cellCultureLines = resp;
            setTimeout(() => {
                this.accordion.openAll();
            }, 500);
        });
    }
    
    addNewCellCultureLine(cellCultureLine = null): void {
        let cloneCellLines;
        if (cellCultureLine) {
            cloneCellLines = this.cellCultureLines.filter(c => c.id !== cellCultureLine.id);
        } else {
            cloneCellLines = this.cellCultureLines;
        }
        const dialogRef = this.dialog.open(NewCellCultureLineComponent, {
            data: {
                cellCultureLine: cellCultureLine,
                cloneCellLines: cloneCellLines
            }
        });
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.cellCultureLine) {
                if (cellCultureLine) {
                    const index = this.cellCultureLines.findIndex(c => c.id === cellCultureLine.id);
                    this.cellCultureLines[index] = resp.cellCultureLine;
                } else {
                    this.cellCultureLines.push(resp.cellCultureLine);
                }
            }
        });
        
    }
    
    clickExpand(): void {
        if (this.expanded) {
            this.accordion.closeAll();
        } else {
            this.accordion.openAll();
        }
        this.expanded = !this.expanded;
    }
    
    createEvent(row): void {
        const dialogRef = this.dialog.open(NewCellCultureEventComponent, {data: {cellCultureLine: row}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.event) {
                if (resp.event.log_type === 'remove_cell_line') {
                    this.cellCultureLines = this.cellCultureLines.filter(c => c.id !== row.id);
                } else {
                    const index = this.cellCultureLines.findIndex(c => c.id === row.id);
                    this.cellCultureLines[index] = resp.cell;
                }
            }
        });
    }
    
    removeCellLine(cellCultureLine): void {
        const dialogRef = this.dialog.open(RemoveCellCultureLineComponent, {data: {cellCultureLine: cellCultureLine}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.event) {
                this.cellCultureLines = this.cellCultureLines.filter(c => c.id !== cellCultureLine.id);
            }
        });
    }
}

