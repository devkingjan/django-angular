import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-select-date',
    templateUrl: './select-date.component.html',
    styleUrls: ['./select-date.component.scss']
})
export class SelectDateComponent implements OnInit {
    selectedDate: any;
    
    constructor(
        public dialogRef: MatDialogRef<SelectDateComponent>
    ) {
    }
    
    ngOnInit(): void {
    }
    selected(): void {
        console.log(new Date(this.selectedDate.valueOf()));
        this.dialogRef.close({date: new Date(this.selectedDate.valueOf())});
    }
    
}
