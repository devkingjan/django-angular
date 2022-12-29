import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
let optionName = '';
@Component({
  selector: 'app-remove-option',
  templateUrl: './remove-option.component.html',
  styleUrls: ['./remove-option.component.scss']
})
export class RemoveOptionComponent implements OnInit {
    confirmForm: FormGroup;
    name = '';
    constructor(
        private _formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<RemoveOptionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        optionName = data.name;
        this.name = data.name;
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

