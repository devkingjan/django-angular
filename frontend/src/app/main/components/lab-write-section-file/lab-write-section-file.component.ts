import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LabSectionData} from '../../../models/lab-write';

@Component({
  selector: 'app-lab-write-section-file',
  templateUrl: './lab-write-section-file.component.html',
  styleUrls: ['./lab-write-section-file.component.scss']
})
export class LabWriteSectionFileComponent implements OnInit {
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
