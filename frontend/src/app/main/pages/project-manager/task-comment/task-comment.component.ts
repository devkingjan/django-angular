import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ProjectTask} from "../../../../models/project-task";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Member} from "../../../../models/member";
import {Project} from "../../../../models/project";
import {ApiService} from "../../../../../@fuse/api/api.service";
import {FuseProgressBarService} from "../../../../../@fuse/components/progress-bar/progress-bar.service";
import {TaskComment} from "../../../../models/task-comment";

@Component({
  selector: 'app-task-comment',
  templateUrl: './task-comment.component.html',
  styleUrls: ['./task-comment.component.scss']
})
export class TaskCommentComponent implements OnInit {
    task: ProjectTask;
    comment: TaskComment;
    newForm: FormGroup;
    submitted = false;
    constructor(
        private formBuilder: FormBuilder,
        private progress: FuseProgressBarService,
        private api: ApiService,
        public dialogRef: MatDialogRef<TaskCommentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.task = data.task;
        this.comment = data.comment;
      
        if (this.comment) {
            this.newForm = this.formBuilder.group({
                comment: [this.comment.comment, [Validators.required]],
            });
        } else {
            this.newForm = this.formBuilder.group({
                comment: ['', [Validators.required]],
            });
        }
    }
    
    ngOnInit(): void {
    }
    
    addComment(): void {
        this.progress.show();
        this.submitted = true;
        if (this.comment) {
            this.api.project.editComment(this.task.id, this.newForm.value).promise().then(resp => {
                this.dialogRef.close({task: resp});
                this.progress.hide();
                this.submitted = false;
            });
        } else {
            this.newForm.value['task'] = this.task.id;
            this.api.project.addComment(this.newForm.value).promise().then(resp => {
                this.dialogRef.close({task: resp});
                this.progress.hide();
                this.submitted = false;
            });
        }
        
    }
}

