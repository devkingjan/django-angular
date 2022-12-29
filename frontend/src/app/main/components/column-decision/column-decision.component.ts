import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-column-decision',
  templateUrl: './column-decision.component.html',
  styleUrls: ['./column-decision.component.scss']
})
export class ColumnDecisionComponent implements OnInit {
    @Input() question: string;
    @Output() answer = new EventEmitter();
    constructor(
    ) {
    }
    
    ngOnInit(): void {
    }
    onClick(val: boolean): void {
        this.answer.emit({answer: val});
    }

}
