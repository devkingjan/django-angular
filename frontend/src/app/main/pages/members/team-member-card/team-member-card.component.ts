import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MemberStatisticComponent} from '../member-statistic/member-statistic.component';
import {ViewEmergencyContactComponent} from '../../../components/view-emergency-contact/view-emergency-contact.component';
import {Task} from '../../../../models/task';
import {NewTaskComponent} from '../../../components/new-task/new-task.component';
import {User} from '../../../../models/user';
import { Router} from '@angular/router';

@Component({
    selector: 'app-team-member-card',
    templateUrl: './team-member-card.component.html',
    styleUrls: ['./team-member-card.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TeamMemberCardComponent implements OnInit {
    @Input() member: User;
    @Input() members: User[];
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
    
    
    viewPersonalStatistic(): void {
        const dialogRef = this.dialog.open(MemberStatisticComponent, {
            data: {member: this.member}
        });
        dialogRef.afterClosed().subscribe(result => {
        
        });
    }
    
    viewEmergencyContact(): void {
        this.dialog.open(ViewEmergencyContactComponent, {
            data: {user: this.member}
        });
    }
    
    addNewTask(): void {
        const task = new Task();
        const dialogRef = this.dialog.open(NewTaskComponent, {data: {task, user: this.member}});
        dialogRef.afterClosed().subscribe(resp => {
        });
    }
    
    viewDataStorage(): void {
        this.router.navigate([`/pages/member/${this.member.id}/storage`],
            { queryParams: { key: `${this.member.folder_name}/public`, name: `${this.member.first_name} ${this.member.last_name}`}});
    }
}
