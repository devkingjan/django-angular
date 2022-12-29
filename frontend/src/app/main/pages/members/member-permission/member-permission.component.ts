import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Member} from '../../../../models/member';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {FuseProgressBarService} from '../../../../../@fuse/components/progress-bar/progress-bar.service';

@Component({
  selector: 'app-member-permission',
  templateUrl: './member-permission.component.html',
  styleUrls: ['./member-permission.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MemberPermissionComponent implements OnInit {
    member: Member;
    members: Member[];
    submitted = false;
    checkedPermissions = [];
    permissions: number[] = [];
    labAccessMembers: number[] = [];
    checkedLabAccessMembers = [];
    permissionList = [
        {title: 'Can create new Inventory databases', id: 0},
        {title: 'Can edit existing Inventory databases', id: 1},
        {title: 'Can create new storage locations', id: 2},
        {title: 'Can create edit existing storage locations', id: 3},
        {title: 'Can delete storage locations', id: 4},
        {title: 'Can create new Experiment databases', id: 6},
        {title: 'Can edit existing Experiment databases', id: 5},
        {title: 'Can create new projects', id: 6},
        {title: 'Can add team members to existing projects', id: 7},
        {title: 'Can review other team members work', id: 8},
        {title: 'Can use E-signature', id: 9},
    ];
    //  permissionList = [
    //     {title: 'Can create templates', id: 0},
    //     {title: 'Can edit existing templates', id: 1},
    //     {title: 'Can create new protocols', id: 2},
    //     {title: 'Can create edit existing protocols', id: 3},
    //     {title: 'Can create new buffer recipes', id: 4},
    //     {title: 'Can edit existing butter recipes', id: 5},
    //     {title: 'Can create new projects', id: 6},
    //     {title: 'Can add team members to existing projects', id: 7},
    //     {title: 'Can review other team members work', id: 8},
    //     {title: 'Can use E-signature', id: 9},
    // ];
    constructor(
        private progress: FuseProgressBarService,
        private api: ApiService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<MemberPermissionComponent>
    ) {
        this.member = data.member;
        this.members = data.members.filter(m => m.id !== this.member.id);
    }
    
    ngOnInit(): void {
        this.getMemberPermissions();
    }
    getMemberPermissions(): void {
        this.api.member.getPermission(this.member.id).promise().then(resp => {
            this.permissions = resp.permissions;
            this.checkedPermissions = Object.assign([], this.permissions);
            this.labAccessMembers = resp.lab_access_members;
            this.checkedLabAccessMembers = Object.assign([], this.labAccessMembers);
        });
    }
    onChangePermission(val, permission): void {
        if (val.checked) {
            this.checkedPermissions.push(permission);
        } else {
            this.checkedPermissions = this.checkedPermissions.filter(p => p !== permission);
        }
    }
    
     onChangeAccessMember(val, memId): void {
        if (val.checked) {
            this.checkedLabAccessMembers.push(memId);
        } else {
            this.checkedLabAccessMembers = this.checkedLabAccessMembers.filter(p => p !== memId);
        }
    }
    save(): void {
        this.submitted = true;
        this.progress.show();
        const request = {
            permissions: this.checkedPermissions,
            members: this.checkedLabAccessMembers,
            id: this.member.id
        };
        this.api.member.updatePermission(request).promise().then(resp => {
           this.dialogRef.close();
           this.progress.hide();
           this.submitted = false;
        });
    }
    close(): void {
       this.dialogRef.close();
    }

}
