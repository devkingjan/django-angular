import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-create-item-with-name',
  templateUrl: './create-item-with-name.component.html',
  styleUrls: ['./create-item-with-name.component.scss']
})
export class CreateItemWithNameComponent implements OnInit {
    newForm: FormGroup;
    constructor(
        private _formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<CreateItemWithNameComponent>
    ) {
        this.newForm = this._formBuilder.group({
            name: ['', [Validators.required]]
        });
    }
    
    ngOnInit(): void {
    }
    submit(): void {
        this.dialogRef.close(this.newForm.value);
    }

}
