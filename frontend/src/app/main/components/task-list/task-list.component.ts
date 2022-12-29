import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Task} from '../../../models/task';
import {MatDialog} from '@angular/material/dialog';
import {NewTaskListComponent} from '../new-task-list/new-task-list.component';
import {ApiService} from '../../../../@fuse/api/api.service';
import {NotifyService} from '../../../../@fuse/services/notify.service';
import {RemoveWithConfirmComponent} from '../remove-with-confirm/remove-with-confirm.component';

@Component({
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskListComponent implements OnInit {
    taskListArray = [];
    selectedTaskList: any = null;
    noDueDateTasks: Task[] = [];
    overDueTasks: Task[] = [];
    dueDateTasks: Task[] = [];
    constructor(
        private notifyService: NotifyService,
        private dialog: MatDialog,
        private api: ApiService,
    ) {
        this.notifyService.getTaskManagerUpdateState
            .subscribe(
                (notify) => {
                    if (notify.state && notify.position === 'daily-task' && this.selectedTaskList) {
                        this.refresh();
                    }
                }
            );
    }
    
    ngOnInit(): void {
        this.getTaskList();
    }
    
    getTasks(): void {
        this.api.taskManager.getTask().params({task_list: this.selectedTaskList}).promise().then(resp => {
            this.noDueDateTasks = resp.filter(r => r.due_date === null);
            this.dueDateTasks = resp.filter(r => r.due_date !== null);
        });
    }
    
    getOverDueTasks(): void {
        const today = new Date();
        const request = {
            today: `${today.getUTCFullYear()}-${today.getMonth()}-${today.getDate()}`,
            task_list: this.selectedTaskList
        };
        this.api.taskManager.getOverDueTaskList(request).promise().then(resp => {
            this.overDueTasks = resp.overDueTasks;
            this.noDueDateTasks = resp.noDueDateTasks;
            this.dueDateTasks = resp.dueDateTasks;
        });
    }
    
    getTaskList(): void {
        this.api.taskManager.getTaskList().promise().then(resp => {
            this.taskListArray = resp;
            if (resp.length) {
                this.selectedTaskList = this.taskListArray[0].id;
                this.getOverDueTasks();
            } else {
                this.taskListArray = [];
                this.noDueDateTasks = [];
                this.dueDateTasks = [];
                this.overDueTasks = [];
            }
        });
    }
    
    selectTaskList(): void {
        this.refresh();
    }
    
    createNewTaskList(): void {
        const dialogRef = this.dialog.open(NewTaskListComponent);
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.data) {
                this.taskListArray.push(resp.data);
            }
        });
    }
    
    deleteTaskList(): void {
        const taskList = this.taskListArray.find(t => t.id === this.selectedTaskList);
        const dialogRef = this.dialog.open(RemoveWithConfirmComponent, {data:
                {description: ``, name: taskList.name, title: `Are you sure you want to delete List: "${taskList.name}"?`}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.confirm) {
                this.api.taskManager.deleteTaskList(this.selectedTaskList).promise().then(resp => {
                    this.getTaskList();
                    this.notifyService.refreshTaskManager = {state: true, position: 'task-list'};
                });
            }
        });
    }
    
    refresh(): void {
        this.getOverDueTasks();
    }
}
