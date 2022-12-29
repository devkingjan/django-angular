import {Component, OnInit} from '@angular/core';
import {Task} from '../../../models/task';
import {MatDialog} from '@angular/material/dialog';
import {SelectDateComponent} from '../select-date/select-date.component';
import {NewTaskComponent} from '../new-task/new-task.component';
import {ApiService} from '../../../../@fuse/api/api.service';
import {NotifyService} from '../../../../@fuse/services/notify.service';
import {UtilsService} from '../../../../@fuse/services/utils.service';
import {User} from '../../../models/user';
import {MeService} from '../../../../@fuse/services/me.service';

@Component({
    selector: 'app-daily-task',
    templateUrl: './daily-task.component.html',
    styleUrls: ['./daily-task.component.scss']
})
export class DailyTaskComponent implements OnInit {
    weekDays = [];
    selectedDate = new Date();
    noDueDateTasks: Task[] = [];
    selectedDateTasks: Task[] = [];
    overDueDateTasks: Task[] = [];
    user: User;
    constructor(
        private utils: UtilsService,
        private notifyService: NotifyService,
        private api: ApiService,
        private dialog: MatDialog,
        private me: MeService,
    ) {
        this.user = this.me.meUser;
        this.notifyService.getTaskManagerUpdateState
            .subscribe(
                (notify) => {
                    if (notify.state && notify.position === 'task-list') {
                        this.refresh();
                    }
                }
            );
    }
    
    ngOnInit(): void {
        this.getWeekDays();
        this.getNoDueOverDueTask();
        this.getSelectedDateTask();
    }
    
    getNoDueOverDueTask(): void {
        const today = new Date();
        const request = {
            today: `${today.getUTCFullYear()}-${today.getMonth()}-${today.getDate()}`,
        };
        this.api.taskManager.getNoDueOverDueTask(request).promise().then(resp => {
            this.noDueDateTasks = resp['noDueDateTasks'];
            this.overDueDateTasks = resp['overDueDateTasks'];
        });
    }
    
    getSelectedDateTask(): void {
        this.api.taskManager.getTask()
            .params({due_date: `${this.selectedDate.getUTCFullYear()}-${this.selectedDate.getUTCMonth()}-${this.selectedDate.getUTCDate()}`}).promise().then(resp => {
            this.selectedDateTasks = resp;
        });
    }
    
    getWeekDays(): any {
        const current = new Date(this.selectedDate);
        this.weekDays = new Array();
        current.setDate((current.getDate() - current.getDay()));
        for (let i = 0; i < 8; i++) {
            this.weekDays.push(
                new Date(current)
            );
            current.setDate(current.getDate() + 1);
        }
    }
    
    addNewTask(): void {
        const task = new Task();
        const dialogRef = this.dialog.open(NewTaskComponent, {data: {task, user: this.user}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.task) {
                this.refresh();
                this.notifyService.refreshTaskManager = {state: true, position: 'daily-task'};
            }
        });
    }
    
    viewOtherDate(): void {
        const dialogRef = this.dialog.open(SelectDateComponent, {});
        dialogRef.afterClosed().subscribe(res => {
            if (res && res.date) {
                this.selectedDate = res.date;
                this.getWeekDays();
                this.getSelectedDateTask();
            }
        });
    }
    
    selectDate(val): void {
        this.selectedDate = val;
        this.refresh();
    }
    
    refresh(): void {
        this.getSelectedDateTask();
        this.getNoDueOverDueTask();
    }
}
