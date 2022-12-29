import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
let column = '';
@Component({
  selector: 'app-confirm-deletion',
  templateUrl: './confirm-deletion.component.html',
  styleUrls: ['./confirm-deletion.component.scss']
})
export class ConfirmDeletionComponent implements OnInit {
    confirmForm: FormGroup;
    columnName = '';
    databaseName = '';
    constructor(
        private _formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<ConfirmDeletionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        column = data.column;
        this.columnName = data.column;
        this.databaseName = data.dbName;
        this.confirmForm = this._formBuilder.group({
            name: ['', [Validators.required]]
        }, {validator: this.checkConfirm});
    }
    
    ngOnInit(): void {
    }
    checkConfirm(group: FormGroup): any {
      const name = group.get('name').value;
      return name === column ? null : { notSame: true };
    }
    submit(val): void {
        this.dialogRef.close({confirm: val});
    }

}
