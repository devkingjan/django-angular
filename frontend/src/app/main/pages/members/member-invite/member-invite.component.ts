import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FuseProgressBarService} from '../../../../../@fuse/components/progress-bar/progress-bar.service';
import {Member} from '../../../../models/member';
import {User} from '../../../../models/user';
import {MeService} from '../../../../../@fuse/services/me.service';

@Component({
  selector: 'app-member-invite',
  templateUrl: './member-invite.component.html',
  styleUrls: ['./member-invite.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MemberInviteComponent implements OnInit {
    member: Member;
    meUser: User;
    constructor(
      private progressService: FuseProgressBarService,
      private api: ApiService,
      private me: MeService,
      private _snackBar: MatSnackBar,
      public dialogRef: MatDialogRef<MemberInviteComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.member = data.member;
      this.meUser = this.me.meUser;
    }
    
    ngOnInit(): void {
    }
    sendInvitation(): void {
        this.progressService.show();
        console.log(this.member.id);
        this.api.member.invite({member_id: this.member.id}).promise().then(resp => {
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

