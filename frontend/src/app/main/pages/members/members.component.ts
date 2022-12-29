import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MemberNewComponent} from './member-new/member-new.component';
import {ApiService} from '../../../../@fuse/api/api.service';
import {Member} from '../../../models/member';
import {FuseProgressBarService} from '../../../../@fuse/components/progress-bar/progress-bar.service';
import {Router} from '@angular/router';
import {fuseAnimations} from '../../../../@fuse/animations';
import {MeService} from '../../../../@fuse/services/me.service';
import {User} from '../../../models/user';
import {UtilsService} from "../../../../@fuse/services/utils.service";

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class MembersComponent implements OnInit {
    members: Member[] = [];
    user: User;
    isAdmin = true;
    constructor(
        private me: MeService,
        private util: UtilsService,
        private progress: FuseProgressBarService,
        private router: Router,
        private dialog: MatDialog,
        private api: ApiService,
    ) {
        this.user = this.me.meUser;
        this.isAdmin = this.user.user_role === this.util.ROLE_COMPANY_ADMIN;
    }
    ngOnInit(): void {
        this.getMembers();
    }
    getMembers(): void {
        this.progress.show();
        this.api.member.get().params({team: !this.isAdmin}).promise().then(resp => {
          this.members = resp;
          this.progress.hide();
        }).catch(error => {
            this.router.navigate(['/pages/experiments']);
        });
    }
    
    addMember(): void {
        const dialogRef = this.dialog.open(MemberNewComponent, {
          data: {name: 'fdefefef'}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.resp) {
                console.log(result.resp);
                this.members.push(result.resp);
            }
        });
    }
    

}
