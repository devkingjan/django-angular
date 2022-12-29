import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
let optionName = '';

@Component({
  selector: 'app-remove-with-confirm',
  templateUrl: './remove-with-confirm.component.html',
  styleUrls: ['./remove-with-confirm.component.scss']
})
export class RemoveWithConfirmComponent implements OnInit {

    confirmForm: FormGroup;
    description = '';
    name = '';
    title = '';
    constructor(
        private _formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<RemoveWithConfirmComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        optionName = data.name;
        this.name = data.name;
        this.title = data.title;
        this.description = data.description;
        this.confirmForm = this._formBuilder.group({
            name: ['', [Validators.required]]
        }, {validator: this.checkConfirm});
    }
    
    ngOnInit(): void {
    }
    checkConfirm(group: FormGroup): any {
      const name = group.get('name').value;
      return name === optionName ? null : { notSame: true };
    }
    submit(val): void {
        this.dialogRef.close({confirm: val});
    }

}

