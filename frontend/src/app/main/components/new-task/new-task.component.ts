import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Task} from '../../../models/task';
import {ApiService} from '../../../../@fuse/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from '../../../models/user';

@Component({
    selector: 'app-new-task',
    templateUrl: './new-task.component.html',
    styleUrls: ['./new-task.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NewTaskComponent implements OnInit {
    user: User;
    newForm: FormGroup;
    isToday = false;
    isTomorrow = false;
    task: Task;
    taskListArray: any;
    selectedDate: any = null;
    dueDate: any = null;
    submitted = false;
    
    constructor(
        private api: ApiService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<NewTaskComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.task = this.data.task;
        this.user = this.data.user;
        this.newForm = this._formBuilder.group({
            name: [this.task.name, [Validators.required]],
            task_list: [this.task.task_list, [Validators.required]],
        });
        if (this.task.due_date) {
            const today = new Date();
            const date = this.task.due_date.split('-');
            this.selectedDate = new Date(Date.UTC(parseInt(date[0], 10), parseInt(date[1], 10), parseInt(date[2], 10)) + today.getTimezoneOffset() * 60 * 1000);
            this.checkTodayTomorrow(this.selectedDate);
        }
    }
    
    ngOnInit(): void {
        this.getTaskList();
    }
    
    getTaskList(): void {
        this.api.taskManager.getTaskList().params({user: this.user.id}).promise().then(resp => {
            this.taskListArray = resp;
        });
    }
    
    assignToday(): void {
        this.isTomorrow = false;
        this.isToday = true;
        this.dueDate = new Date();
    }
    
    assignTomorrow(): void {
        this.isToday = false;
        this.isTomorrow = true;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.dueDate = tomorrow;
    }
    
    selectDate(): void {
        this.checkTodayTomorrow(this.selectedDate);
    }
    
    checkTodayTomorrow(date): void {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        this.isToday = false;
        this.isTomorrow = false;
        this.dueDate = new Date(date);
        if (this.dueDate.getFullYear() === today.getFullYear() && this.dueDate.getMonth() === today.getMonth() && this.dueDate.getDate() === today.getDate()) {
            this.isToday = true;
        }
        if (this.dueDate.getFullYear() === tomorrow.getFullYear() && this.dueDate.getMonth() === tomorrow.getMonth() && this.dueDate.getDate() === tomorrow.getDate()) {
            this.isTomorrow = true;
        }
    }
    
    create(): void {
        if (this.dueDate) {
            this.newForm.value['due_date'] = `${this.dueDate.getUTCFullYear()}-${this.dueDate.getUTCMonth()}-${this.dueDate.getUTCDate()}`;
        }
        this.submitted = true;
        if (this.task.id) {
            this.api.taskManager.editTask(this.task.id, this.newForm.value).params({user: this.user.id}).promise().then(resp => {
                this.dialogRef.close({task: resp});
                this.submitted = false;
            });
        } else {
            this.api.taskManager.createTask(this.newForm.value).params({user: this.user.id}).promise().then(resp => {
                this.dialogRef.close({task: resp});
                this.submitted = false;
            });
        }
        
    }
    
}
