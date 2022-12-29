import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '../../../models/user';

@Component({
    selector: 'app-view-emergency-contact',
    templateUrl: './view-emergency-contact.component.html',
    styleUrls: ['./view-emergency-contact.component.scss']
})
export class ViewEmergencyContactComponent implements OnInit {
    user: User;
    constructor(
        public dialogRef: MatDialogRef<ViewEmergencyContactComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.user = data.user;
    }
    
    ngOnInit(): void {
    }
    
}
