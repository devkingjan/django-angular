import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LabSectionData} from '../../../models/lab-write';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-lab-write-section-text',
  templateUrl: './lab-write-section-text.component.html',
  styleUrls: ['./lab-write-section-text.component.scss']
})
export class LabWriteSectionTextComponent implements OnInit {
    @Input() index: number;
    @Input() data: LabSectionData;
    @Input() disabled: boolean;
    @Output('deleteSection') deleteSection: EventEmitter<any> = new EventEmitter();
    @Output('editSection') editSection: EventEmitter<any> = new EventEmitter();

    edit = false;
    editorContent = 'test';

    constructor() {}

    ngOnInit(): void {
        if (this.data.data) {
            setTimeout(() => {
                this.editorContent = this.data.data;
                document.querySelector(`.editor-mode${this.index} .ql-editor`).innerHTML = this.data.data;
            }, 100);
        }
    }

    onEditSection(): void {
        this.edit = !this.edit;
    }

    onDeleteSection(): void {
        this.deleteSection.emit(this.index);
    }

    onChange(event): void {
        this.data.data = event;
        this.editSection.emit({index: this.index, data: this.data});
    }

    onContentChanged(event): void {
        this.data.data = event.html;
        this.editSection.emit({index: this.index, data: this.data});
    }
}
