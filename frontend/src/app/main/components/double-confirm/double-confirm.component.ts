import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-double-confirm',
  templateUrl: './double-confirm.component.html',
  styleUrls: ['./double-confirm.component.scss']
})
export class DoubleConfirmComponent implements OnInit {
    dataObj: any;
    description: any;
    constructor(
        public dialogRef: MatDialogRef<DoubleConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
         this.dataObj = data.dataObj;
         this.description = data.description;
    }

  ngOnInit(): void {
  }

}

