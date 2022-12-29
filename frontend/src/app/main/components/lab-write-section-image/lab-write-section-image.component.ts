import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LabSectionData} from '../../../models/lab-write';

@Component({
    selector: 'app-lab-write-section-image',
    templateUrl: './lab-write-section-image.component.html',
    styleUrls: ['./lab-write-section-image.component.scss']
})
export class LabWriteSectionImageComponent implements OnInit {
    @Input() index: number;
    @Input() data: LabSectionData;
    @Input() disabled: boolean;

    @Output('deleteSection') deleteSection: EventEmitter<any> = new EventEmitter();

    constructor() {
    }

    ngOnInit(): void {
    }

    onDeleteSection(): void {
        this.deleteSection.emit(this.index);
    }

}
