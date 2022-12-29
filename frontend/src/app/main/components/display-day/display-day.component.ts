import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-display-day',
    templateUrl: './display-day.component.html',
    styleUrls: ['./display-day.component.scss']
})
export class DisplayDayComponent implements OnInit {
    @Input() displayDay: any;
    @Input() selectedDay: any;
    @Output() submitDate = new EventEmitter();
    constructor() {
    }
    
    ngOnInit(): void {
    }
    
    getStatTime(d): any {
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d;
    }
    
    selectDate(): void {
        this.submitDate.emit(this.displayDay);
    }
    
    isSelected(): boolean {
        const isSelected = this.getStatTime(new Date(this.displayDay)).getTime() === this.getStatTime(new Date(this.selectedDay)).getTime();
        return isSelected;
    }
    
}
