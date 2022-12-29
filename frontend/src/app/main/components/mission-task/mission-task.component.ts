import {Component, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {Task} from '../../../models/task';
import {NewTaskComponent} from '../new-task/new-task.component';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmRequestComponent} from '../confirm-request/confirm-request.component';
import {ApiService} from '../../../../@fuse/api/api.service';
import {User} from "../../../models/user";
import {MeService} from "../../../../@fuse/services/me.service";

@Component({
    selector: 'app-mission-task',
    templateUrl: './mission-task.component.html',
    styleUrls: ['./mission-task.component.scss']
})
export class MissionTaskComponent implements OnInit {
    selectedDate = new Date();
    expanded = true;
    tasks: Task[] = [];
    getResponse = false;
    panelOpenState = false;
    user: User;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    
    constructor(
        private api: ApiService,
        private dialog: MatDialog,
        private me: MeService
    ) {
        this.user = this.me.meUser;
    }
    
    ngOnInit(): void {
        this.getSelectedDateTask();
        this.getNoDueOverDueTask();
    }
    
    getNoDueOverDueTask(): void {
        const request = {
            today: `${this.selectedDate.getUTCFullYear()}-${this.selectedDate.getUTCMonth()}-${this.selectedDate.getUTCDate()}`,
        };
        this.api.taskManager.getNoDueOverDueTask(request).promise().then(resp => {
            this.tasks = this.tasks.concat(resp['noDueDateTasks']);
            this.tasks = this.tasks.concat(resp['overDueDateTasks']);
            setTimeout(() => {
                this.accordion.openAll();
            }, 500);
        });
    }
    
    getSelectedDateTask(): void {
        this.api.taskManager.getTask()
            .params({due_date: `${this.selectedDate.getUTCFullYear()}-${this.selectedDate.getUTCMonth()}-${this.selectedDate.getUTCDate()}`}).promise().then(resp => {
            this.tasks = this.tasks.concat(resp);
        });
    }
    
    addNewTask(): void {
        const task = new Task();
        const dialogRef = this.dialog.open(NewTaskComponent, {data: {task, user: this.user}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.task) {
                this.refresh(resp.task);
            }
        });
    }
    
    clickExpand(): void {
        if (this.expanded) {
            this.accordion.closeAll();
        } else {
            this.accordion.openAll();
        }
        this.expanded = !this.expanded;
    }
    
    checkTask(task): void {
        task.completed_at = new Date();
        this.api.taskManager.editTask(task.id, task).promise().then(() => {
        });
    }
    
    editTask(task): void {
        const dialogRef = this.dialog.open(NewTaskComponent, {data: {task}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.task) {
                const index = this.tasks.findIndex(t => t.id === task.id);
                this.tasks[index] = resp.task;
            }
        });
    }
    
    deleteTask(task): void {
        const dialogRef = this.dialog.open(ConfirmRequestComponent, {
            data:
                {
                    description: `Are you sure you want to delete task:  "${task.name}"? This action can’t be undone.`,
                    yesText: 'Delete',
                    noText: 'Cancel'
                }
        });
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.answer) {
                this.api.taskManager.deleteTask(task.id).promise().then(() => {
                    this.tasks = this.tasks.filter(t => t.id !== task.id);
                });
            }
        });
    }
    
    refresh(task): void {
        if (!task.due_date) {
            this.tasks.push(task);
        }
        const _date = task.due_date.split('-');
        const taskDue = new Date(Date.UTC(parseInt(_date[0], 10), parseInt(_date[1], 10), parseInt(_date[2], 10)));
        if (taskDue <= new Date()) {
            this.tasks.push(task);
        }
    }
    
}
