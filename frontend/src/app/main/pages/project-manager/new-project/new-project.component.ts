import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../../../models/user";
import {Member} from "../../../../models/member";
import {ApiService} from "../../../../../@fuse/api/api.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
    selector: 'app-new-project',
    templateUrl: './new-project.component.html',
    styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {
    project: any = null;
    newForm: FormGroup;
    submitted = false;
    selectedMembers: Member[] = [];
    members: Member[] = [];
    
    constructor(
        private api: ApiService,
        private formBuilder: FormBuilder,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<NewProjectComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.project = data.project;
        this.members = data.members;
        if (this.project) {
            this.selectedMembers = this.project.member_list;
            this.newForm = this.formBuilder.group({
                name: [this.project.name, [Validators.required]]
            });
        } else {
            this.newForm = this.formBuilder.group({
                name: ['', [Validators.required]]
            });
        }
    }
    
    ngOnInit(): void {
    }
    
    checkMember(member): boolean {
        const index = this.selectedMembers.findIndex(m => m.id === member.id);
        return index === -1;
    }
    
    onSelectMember(member): void {
        const index = this.selectedMembers.findIndex(m => m.id === member.id);
        if (index === -1) {
            this.selectedMembers.push(member);
        } else {
            this.selectedMembers = this.selectedMembers.filter(m => m.id !== member.id);
        }
    }
    
    submit(): void {
        const memberList = [];
        this.selectedMembers.forEach(m => {
            memberList.push(m.id);
        });
        this.newForm.value['members'] = memberList;
        if (this.project) {
            this.api.project.editProject(this.project.id, this.newForm.value).promise().then(resp => {
                this.dialogRef.close({project: resp});
            }).catch( () => {
                this.snackBar.open('Members is required', 'warning', {duration: 3000});
            });
        } else {
            this.api.project.createProject(this.newForm.value).promise().then(resp => {
                this.dialogRef.close({project: resp});
            }).catch( () => {
                this.snackBar.open('Members is required', 'warning', {duration: 3000});
            });
        }
        
    }
    
}
