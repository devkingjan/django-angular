import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';

@Component({
    selector: 'app-lab-doc',
    templateUrl: './lab-doc.component.html',
    styleUrls: ['./lab-doc.component.scss']
})
export class LabDocComponent implements OnInit {
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @Input() data: any[];
    @Output('changeExpand') changeExpand: EventEmitter<any> = new EventEmitter();
    @Output('selectExpVersion') selectExpVersion: EventEmitter<any> = new EventEmitter();

    expanded = false;
    selectedExperimentVersion: any;

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

    onSelectExperimentVersion(expVersionId): void {
        this.selectedExperimentVersion = this.data.find(item => {
            if (item.id === expVersionId) {
                return item;
            }
        });
    }

    onRestoreExpVersion(expVersionId): void {
        this.selectExpVersion.emit(expVersionId);
    }

}
