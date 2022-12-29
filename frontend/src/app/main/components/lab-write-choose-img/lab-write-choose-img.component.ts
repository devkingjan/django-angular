import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-lab-write-choose-img',
    templateUrl: './lab-write-choose-img.component.html',
    styleUrls: ['./lab-write-choose-img.component.scss']
})
export class LabWriteChooseImgComponent implements OnInit {
    uploadType: string;

    constructor(
        public dialogRef: MatDialogRef<LabWriteChooseImgComponent>,
    ) {
    }

    ngOnInit(): void {
    }

    setUploadPath(event): void {
        this.uploadType = event.value;
        this.dialogRef.close({imgPath: this.uploadType});
    }

}
