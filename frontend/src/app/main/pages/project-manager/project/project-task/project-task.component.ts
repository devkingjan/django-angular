import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FuseConfigService} from "../../../../../../@fuse/services/config.service";
import {Task} from "../../../../../models/task";
import {ProjectTask} from "../../../../../models/project-task";
import {MatDialog} from "@angular/material/dialog";
import {ProjectNewTaskComponent} from "../project-new-task/project-new-task.component";
import {Project} from "../../../../../models/project";
import {ApiService} from "../../../../../../@fuse/api/api.service";
import {FuseProgressBarService} from "../../../../../../@fuse/components/progress-bar/progress-bar.service";
import {ConfirmRequestComponent} from "../../../../components/confirm-request/confirm-request.component";
import {TaskCommentComponent} from "../../task-comment/task-comment.component";

@Component({
    selector: 'app-project-task',
    templateUrl: './project-task.component.html',
    styleUrls: ['./project-task.component.scss']
})
export class ProjectTaskComponent implements OnInit {
    isDark = false;
    isBlind = false;
    @Input() task: ProjectTask;
    @Input() project: Project;
    @Output() delete = new EventEmitter();
    submitted = false;
    statusShow = {
        done: 'Done',
        in_progress: 'In Progress',
        in_planing: 'In Planning',
        on_hold: 'On Hold',
    };
    
    constructor(
        private api: ApiService,
        private progress: FuseProgressBarService,
        private dialog: MatDialog,
        private _fuseConfigService: FuseConfigService,
    ) {
    }
    
    ngOnInit(): void {
        this._fuseConfigService.config.subscribe((config) => {
            this.isDark = config.colorTheme === 'theme-blue-gray-dark';
            this.isBlind = config.colorTheme === 'theme-yellow-light';
        });
    }
    
    changeStatus(): void {
        this.progress.show();
        this.submitted = true;
        this.api.project.editTask(this.task.id, {
            status: this.task.status,
            members: this.task.members
        }).promise().then(resp => {
            this.progress.hide();
            this.submitted = false;
        });
    }
    
    editTask(): void {
        const dialogRef = this.dialog.open(ProjectNewTaskComponent, {data: {task: this.task, project: this.project}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.task) {
                this.task = resp.task;
            }
        });
    }
    
    deleteTask(): void {
        const dialogRef = this.dialog.open(ConfirmRequestComponent,
            {
                data: {
                    description: `Are you sure that delete task "${this.task.title}"?`,
                    yesText: 'Yes',
                    noText: 'No',
                }
            });
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.answer) {
                this.api.project.editTask(this.task.id, {
                    status: 'deleted',
                    members: this.task.members
                }).promise().then(() => {
                    this.delete.emit(this.task);
                });
            }
        });
    }
    
    addComment(): void {
        const dialogRef = this.dialog.open(TaskCommentComponent, {data: {task: this.task}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.task) {
            }
        });
    }
}
