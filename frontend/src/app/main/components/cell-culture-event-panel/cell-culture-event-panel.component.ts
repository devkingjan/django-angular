import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CellCultureEvent} from '../../../models/cell-culture-event';
import {cellCultureEventTypes, cellCultureRemovedReason} from '../../../const';
import {CellCultureLine} from "../../../models/cell-culture-line";

@Component({
    selector: 'app-cell-culture-event-panel',
    templateUrl: './cell-culture-event-panel.component.html',
    styleUrls: ['./cell-culture-event-panel.component.scss']
})
export class CellCultureEventPanelComponent implements OnInit, OnChanges {
    @Input() events: CellCultureEvent[];
    @Input() cellCultureLine: CellCultureLine;
    notes: any[] = [];
    currentIndex = 0;
    currentNote: any = null;
    cellCultureEventTypes: any;
    cellCultureRemovedReason: any;
    constructor() {
        this.cellCultureEventTypes = cellCultureEventTypes;
        this.cellCultureRemovedReason = cellCultureRemovedReason;
    }
    
    ngOnInit(): void {
    }
    
    ngOnChanges(changes: SimpleChanges): void{
        if (changes.events && changes.events.currentValue) {
            this.notes = [];
            if (this.cellCultureLine.note) {
                this.notes.push({
                    time: this.cellCultureLine.date_taken,
                    note: this.cellCultureLine.note
                });
            }
            changes.events.currentValue.forEach(c => {
               if (c.log_type === 'add_note') {
                   this.notes.push({
                    time: c.selected_date,
                    note: c.note
                });
                
               }
            });
            if (this.notes.length && !this.currentNote) {
                this.currentNote = this.notes[0];
            }
        }
    }
    
    updateIndex(delta): void {
        if (this.events.length === 0) {
            return;
        }
        if (delta === -1 && this.currentIndex === 0) {
            this.currentIndex = this.notes.length - 1;
            this.currentNote = this.notes[this.currentIndex];
            return;
        }
        if (delta === 1 && this.currentIndex + 1 === this.notes.length) {
            this.currentIndex = 0;
            this.currentNote = this.notes[this.currentIndex];
            return;
        }
        this.currentIndex = this.currentIndex + delta;
        this.currentNote = this.notes[this.currentIndex];
    }
    
}
