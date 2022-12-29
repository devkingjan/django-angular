import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Company} from '../../../../models/company';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FuseProgressBarService} from '../../../../../@fuse/components/progress-bar/progress-bar.service';

@Component({
  selector: 'app-send-invitation',
  templateUrl: './send-invitation.component.html',
  styleUrls: ['./send-invitation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SendInvitationComponent implements OnInit {
    company: Company;
    constructor(
      private progressService: FuseProgressBarService,
      private api: ApiService,
      private _snackBar: MatSnackBar,
      public dialogRef: MatDialogRef<SendInvitationComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.company = data.company;
    }
    
    ngOnInit(): void {
    }
    sendInvitation(): void {
        this.progressService.show();
        this.api.company.invite({company_id: this.company.id}).promise().then(resp => {
            this._snackBar.open('Sent Invitation Successfully', 'Notice', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
            this.progressService.hide();
            this.dialogRef.close({sent: true});
        }).catch(error => {
            this.progressService.hide();
            this._snackBar.open('Sent Invitation Failed', 'Error', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
        });
    }

}
