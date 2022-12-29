import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ProjectTask} from "../../../../../models/project-task";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Member} from "../../../../../models/member";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Project} from "../../../../../models/project";
import {ApiService} from "../../../../../../@fuse/api/api.service";
import {FuseProgressBarService} from "../../../../../../@fuse/components/progress-bar/progress-bar.service";

@Component({
    selector: 'app-project-new-task',
    templateUrl: './project-new-task.component.html',
    styleUrls: ['./project-new-task.component.scss']
})
export class ProjectNewTaskComponent implements OnInit {
    project: Project;
    task: ProjectTask;
    newForm: FormGroup;
    members: Member[] = [];
    selectedMembers: Member[] = [];
    memberCtrl = new FormControl();
    separatorKeysCodes: number[] = [ENTER, COMMA];
    submitted = false;
    @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    
    constructor(
        private formBuilder: FormBuilder,
        private progress: FuseProgressBarService,
        private api: ApiService,
        public dialogRef: MatDialogRef<ProjectNewTaskComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.project = data.project;
        this.task = data.task;
        if (this.task) {
            this.selectedMembers = this.task.member_list;
            const memberList = [];
            for (const member of this.project.member_list) {
                const findIndex = this.selectedMembers.findIndex(m => m.id === member.id);
                if (findIndex === -1) {
                    memberList.push(member);
                }
            }
            this.members = memberList;
        } else {
            this.members = this.project.member_list;
        }
        if (this.task) {
            this.newForm = this.formBuilder.group({
                title: [this.task.title, [Validators.required]],
                description: [this.task.description, [Validators.required]],
                status: [this.task.status, [Validators.required]],
                start_time: [this.task.start_time, [Validators.required]],
                end_time: [this.task.end_time, [Validators.required]],
            });
        } else {
            this.newForm = this.formBuilder.group({
                title: ['', [Validators.required]],
                description: ['', [Validators.required]],
                status: ['in_planing', [Validators.required]],
                start_time: ['', [Validators.required]],
                end_time: ['', [Validators.required]],
            });
        }
    }
    
    ngOnInit(): void {
    
    }
    
    selected(event: MatAutocompleteSelectedEvent): void {
        this.selectedMembers.push(event.option.value);
        this.members = this.members.filter(m => m.id !== event.option.value.id);
        this.memberInput.nativeElement.value = '';
        this.memberInput.nativeElement.blur();
        this.memberCtrl.setValue(null);
    }
    
    remove(member: Member): void {
        const index = this.selectedMembers.indexOf(member);
        this.members.push(member);
        if (index >= 0) {
            this.selectedMembers.splice(index, 1);
        }
    }
    
    addTask(): void {
        const memberList = [];
        this.selectedMembers.forEach(m => {
            memberList.push(m.id);
        });
        this.newForm.value['members'] = memberList;
        this.newForm.value['project'] = this.project.id;
        this.progress.show();
        this.submitted = true;
        if (this.task) {
            this.api.project.editTask(this.task.id, this.newForm.value).promise().then(resp => {
                this.dialogRef.close({task: resp});
                this.progress.hide();
                this.submitted = false;
            });
        } else {
            this.api.project.addTask(this.newForm.value).promise().then(resp => {
                this.dialogRef.close({task: resp});
                this.progress.hide();
                this.submitted = false;
            });
        }
        
    }
}
