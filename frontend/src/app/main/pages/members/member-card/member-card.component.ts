import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Member} from '../../../../models/member';
import {MemberInviteComponent} from '../member-invite/member-invite.component';
import {MatDialog} from '@angular/material/dialog';
import {MemberStatisticComponent} from '../member-statistic/member-statistic.component';
import {MemberPermissionComponent} from '../member-permission/member-permission.component';
import {Task} from '../../../../models/task';
import {NewTaskComponent} from '../../../components/new-task/new-task.component';
import {ViewEmergencyContactComponent} from '../../../components/view-emergency-contact/view-emergency-contact.component';
import {Router} from '@angular/router';

@Component({
    selector: 'app-member-card',
    templateUrl: './member-card.component.html',
    styleUrls: ['./member-card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MemberCardComponent implements OnInit {
    @Input() member: Member;
    @Input() members: Member[];
    status = {
        0: {
            name: 'Pending',
            color: 'pending'
        },
        1: {
            name: 'Invited',
            color: 'invited'
        },
        2: {
            name: 'Accepted',
            color: 'accepted'
        }
    };
    
    constructor(
        private dialog: MatDialog,
        private router: Router
    ) {
    }
    
    ngOnInit(): void {
    }
    
    sendInvitation(): void {
        const dialogRef = this.dialog.open(MemberInviteComponent, {
            data: {member: this.member}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.sent) {
                this.member.status = 1;
            }
        });
    }
    
    viewPersonalStatistic(): void {
        const dialogRef = this.dialog.open(MemberStatisticComponent, {
            data: {member: this.member}
        });
        dialogRef.afterClosed().subscribe(result => {
        
        });
    }
    
    editPermission(): void {
        const dialogRef = this.dialog.open(MemberPermissionComponent, {
            data: {member: this.member, members: this.members}
        });
        dialogRef.afterClosed().subscribe(result => {
        
        });
    }
    
    viewEmergencyContact(): void {
        this.dialog.open(ViewEmergencyContactComponent, {
            data: {user: this.member.user_info}
        });
    }
    
    addNewTask(): void {
        const task = new Task();
        const dialogRef = this.dialog.open(NewTaskComponent, {data: {task, user: this.member.user_info}});
        dialogRef.afterClosed().subscribe(resp => {
        });
    }
    
    viewDataStorage(): void {
        this.router.navigate([`/pages/member/${this.member.user_info.id}/storage`],
            { queryParams: { key: `${this.member.user_info.folder_name}/public`,
                    name: `${this.member.user_info.first_name} ${this.member.user_info.last_name}`}});
    }
    
}
