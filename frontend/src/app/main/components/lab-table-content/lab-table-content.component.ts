import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';

@Component({
    selector: 'app-lab-table-content',
    templateUrl: './lab-table-content.component.html',
    styleUrls: ['./lab-table-content.component.scss']
})
export class LabTableContentComponent implements OnInit {
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @Input() data: any[];
    @Output('changeExpand') changeExpand: EventEmitter<any> = new EventEmitter();
    @Output('selectedExp') selectedExp: EventEmitter<any> = new EventEmitter();

    expanded = false;
    selectedExperiment: any;

    constructor() {
    }

    ngOnInit(): void {
    }

    clickExpand(): void {
        this.expanded = !this.expanded;
        this.changeExpand.emit(this.expanded);
        if (!this.expanded) {
            this.accordion.closeAll();
        } else {
            this.accordion.openAll();
        }
    }

    onSelectExperiment(expId): void {
        this.selectedExperiment = this.data.find(item => {
            if (item.id === expId) {
                return item;
            }
        });
        this.selectedExp.emit(this.selectedExperiment);
    }

}
