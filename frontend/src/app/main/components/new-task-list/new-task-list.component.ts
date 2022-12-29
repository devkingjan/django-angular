import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../@fuse/api/api.service';

@Component({
    selector: 'app-new-task-list',
    templateUrl: './new-task-list.component.html',
    styleUrls: ['./new-task-list.component.scss']
})
export class NewTaskListComponent implements OnInit {
    newForm: FormGroup;
    
    constructor(
        public dialogRef: MatDialogRef<NewTaskListComponent>,
        private _formBuilder: FormBuilder,
        private api: ApiService
    ) {
        this.newForm = this._formBuilder.group({
            name   : ['', [Validators.required]],
        });
    }
    
    ngOnInit(): void {
    }
    
    create(): void {
        this.api.taskManager.createTaskList(this.newForm.value).promise().then(resp => {
           this.dialogRef.close({data: resp});
        });
    }
    
}
