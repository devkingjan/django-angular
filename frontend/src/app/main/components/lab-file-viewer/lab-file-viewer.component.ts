import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '@fuse/api/api.service';
import {labNotebookSection} from '../../../const';

@Component({
    selector: 'app-lab-file-viewer',
    templateUrl: './lab-file-viewer.component.html',
    styleUrls: ['./lab-file-viewer.component.scss']
})
export class LabFileViewerComponent implements OnInit {

    images: any[]
    files: any[]

    constructor(
        public dialogRef: MatDialogRef<LabFileViewerComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private api: ApiService
    ) {
    }

    ngOnInit(): void {
        const imageParams = {
            experiment: this.data.expId,
            type: labNotebookSection.image
        };
        this.api.experiment.getExperimentEntry().params(imageParams).promise()
            .then(resp => {
                this.images = resp;
            });

        const fileParams = {
            experiment: this.data.expId,
            type: labNotebookSection.file
        };
        this.api.experiment.getExperimentEntry().params(fileParams).promise()
            .then(resp => {
                this.files = resp;
            });
    }

}
