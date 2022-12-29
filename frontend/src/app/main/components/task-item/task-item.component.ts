import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Task} from 'app/models/task';
import {MatDialog} from '@angular/material/dialog';
import {NewTaskComponent} from '../new-task/new-task.component';
import {ConfirmRequestComponent} from '../confirm-request/confirm-request.component';
import {ApiService} from '../../../../@fuse/api/api.service';
import {NotifyService} from '../../../../@fuse/services/notify.service';
import {User} from "../../../models/user";
import {MeService} from "../../../../@fuse/services/me.service";

@Component({
    selector: 'app-task-item',
    templateUrl: './task-item.component.html',
    styleUrls: ['./task-item.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskItemComponent implements OnInit {
    @Input() task: Task;
    @Input() taskType: any;
    @Input() position: any;
    @Output() refresh = new EventEmitter();
    user: User;
    constructor(
        private notifyService: NotifyService,
        private apiService: ApiService,
        private dialog: MatDialog,
        private me: MeService
    ) {
        me.getUser.subscribe(resp => {
            this.user = resp;
        });
    }
    
    ngOnInit(): void {
    }
    
    editTask(): void {
        const dialogRef = this.dialog.open(NewTaskComponent, {data: {task: this.task, user: this.user}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.task) {
                this.refresh.emit();
                console.log(this.position)
                this.notifyService.refreshTaskManager = {state: true, position: this.position};
            }
        });
    }
    
    getDate(date): any {
        const _date = date.split('-');
        const today = new Date();
        const convertDate = new Date(Date.UTC(parseInt(_date[0], 10), parseInt(_date[1], 10), parseInt(_date[2], 10)) + today.getTimezoneOffset() * 60 * 1000);
        return convertDate;
    }
    
    deleteTask(): void {
        const dialogRef = this.dialog.open(ConfirmRequestComponent, {
            data:
                {
                    description: `Are you sure you want to delete task: "${this.task.name}"? This action can’t be undone.`,
                    yesText: 'Delete',
                    noText: 'Cancel'
                }
        });
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.answer) {
                this.apiService.taskManager.deleteTask(this.task.id).promise().then( resp => {
                    this.refresh.emit();
                    this.notifyService.refreshTaskManager = {state: true, position: this.position};
                });
            }
        });
    }
    checkTask(): void {
        this.task.completed_at = new Date();
        this.apiService.taskManager.editTask(this.task.id, this.task).promise().then(resp => {
           this.refresh.emit();
           this.notifyService.refreshTaskManager = {state: true, position: this.position};
        });
    }
    
}
