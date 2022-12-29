import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FuseConfigService} from "../../../../../@fuse/services/config.service";
import {Project} from "../../../../models/project";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ProjectNewTaskComponent} from "./project-new-task/project-new-task.component";
import {ConfirmRequestComponent} from "../../../components/confirm-request/confirm-request.component";
import {ApiService} from "../../../../../@fuse/api/api.service";
import {NewProjectComponent} from "../new-project/new-project.component";
import {Member} from "../../../../models/member";
import {RemoveWithConfirmComponent} from "../../../components/remove-with-confirm/remove-with-confirm.component";

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
    @Input() project: Project;
    @Input() members: Member[];
    @Input() archived: any;
    @Output() delete = new EventEmitter();
    isDark = false;
    isBlind = false;
    
    constructor(
        private api: ApiService,
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
    
    addTaskToProject(): void {
        const dialogRef = this.dialog.open(ProjectNewTaskComponent, {data: {project: this.project, task: null}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.task) {
                this.project.tasks.push(resp.task);
            }
        });
    }
    
    deleteProject(): void {
        const title = `Are you sure that delete project "${this.project.name}"?`;
        const dialogRef = this.dialog.open(RemoveWithConfirmComponent, {
            data:
                {description: ``, name: 'delete', title: title}
        });
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.confirm) {
                this.api.project.deleteProject(this.project.id).promise().then(() => {
                    this.delete.emit(this.project);
                });
            }
        });
    }
    
    archiveProject(): void {
        let description = '';
        let status = null;
        if (this.project.status === 'archived') {
            status = 'active';
            description = `Are you sure that re-activate the project "${this.project.name}"?`;
        } else {
            status = 'archived';
            description = `Are you sure that archive the project "${this.project.name}"?`;
        }
        const dialogRef = this.dialog.open(ConfirmRequestComponent, {
            data: {
                description: description,
                yesText: this.project.status === 'archived' ? 'Re-activate' : 'Archive',
                noText: 'Cancel'
            }
        });
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.answer) {
                this.api.project.editProject(this.project.id, {status: status, members: this.project.members}).promise().then(() => {
                    this.delete.emit(this.project);
                });
            }
        });
    }
    
    editProject(): void {
        const dialogRef = this.dialog.open(NewProjectComponent, {data: {project: this.project, members: this.members}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.project) {
                this.project = resp.project;
            }
        });
    }
    
    deleteTask(task): void {
        this.project.tasks = this.project.tasks.filter(t => t.id !== task.id);
    }
}

