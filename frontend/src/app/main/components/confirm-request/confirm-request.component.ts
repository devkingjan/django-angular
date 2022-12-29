import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-request',
  templateUrl: './confirm-request.component.html',
  styleUrls: ['./confirm-request.component.scss']
})
export class ConfirmRequestComponent implements OnInit {
    description: string;
    yesText: string;
    noText: string;
    constructor(
        public dialogRef: MatDialogRef<ConfirmRequestComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.description = data.description;
        this.yesText = data.yesText;
        this.noText = data.noText;
    }
    
    ngOnInit(): void {
    }
    onClick(val: boolean): void {
        this.dialogRef.close({answer: true});
    }

}