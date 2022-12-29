import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {CreateItemWithNameComponent} from '../../../../../components/create-item-with-name/create-item-with-name.component';

@Component({
  selector: 'app-new-equipment',
  templateUrl: './new-equipment.component.html',
  styleUrls: ['./new-equipment.component.scss']
})
export class NewEquipmentComponent implements OnInit {
    newForm: FormGroup;
    isTower = false;
    rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    constructor(
        private _formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<CreateItemWithNameComponent>
    ) {
        this.newForm = this._formBuilder.group({
            name: ['', [Validators.required]],
            is_tower: [false, [Validators.required]],
            tower_number: [null, []],
        });
    }
    
    ngOnInit(): void {
        this.newForm.valueChanges.subscribe(change => {
            this.isTower = change.is_tower;
            console.log(this.isTower);
        });
    }
    submit(): void {
        this.dialogRef.close({equipment: this.newForm.value});
    }

}
