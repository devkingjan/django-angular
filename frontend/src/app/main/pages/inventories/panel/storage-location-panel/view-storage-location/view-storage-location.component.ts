import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../../../../@fuse/api/api.service';
import {NewStorageLocationComponent} from '../new-storage-location/new-storage-location.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-storage-location',
  templateUrl: './view-storage-location.component.html',
  styleUrls: ['./view-storage-location.component.scss']
})
export class ViewStorageLocationComponent implements OnInit {
    mode: string = null;
    isTower = false;
    databases: any = [];
    storageTemperatures: any = [];
    equipments: any = [];
    storageTypes: any = ['box', 'shelf'];
    allocateNumbers: any = [];
    allocateTowers: any = [];
    newForm: FormGroup;
    oldForm: string = null;
    selectedDatabase: any = null;
    selectedTemperature: any = null;
    selectedEquipment: any = null;
    selectedType: any = null;
    selectedTower: any = null;
    constructor(
        private api: ApiService,
        private _builderForm: FormBuilder,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        public dialogRef: MatDialogRef<ViewStorageLocationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.mode = this.data.mode;
        this.databases = data.databases;
        this.selectedDatabase = data.database;
        this.storageTemperatures = this.selectedDatabase.temperatures;
        this.selectedTemperature = data.temperature;
        this.newForm = this._builderForm.group({
            id: ['', Validators.required],
        });
        this.oldForm = this.newForm.value;
    }
    
    ngOnInit(): void {
        this.getEquipments();
    }
    onSelectDatabase(): void {
        const filter = {
            database: this.selectedDatabase.id,
        };
        this.api.storageLocation.getStorageTemperatures().filter(filter).promise().then(resp => {
           this.storageTemperatures = resp;
        });
    }
    onSelectTemperature(): void {
        this.newForm.get('id') ? this.newForm.get('id').setValue(null) : console.log();
        this.selectedEquipment = null;
        this.selectedTower = null;
        this.selectedType = null;
        const filter = {
            database: this.selectedDatabase.id,
            storage_temperature: this.selectedTemperature.id
        };
        this.api.storageLocation.getEquipmentWithBox().filter(filter).promise().then(resp => {
            this.equipments  = resp;
        });
    }
    onSelectEquipment(): void {
        this.newForm.get('id') ? this.newForm.get('id').setValue(null) : console.log();
        this.selectedTower = null;
        this.selectedType = null;
        this.allocateNumbers = [];
        this.isTower = this.selectedEquipment.is_tower;
        if (this.selectedEquipment.is_tower) {
            this.storageTypes = ['box'];
            this.allocateTowers = this.selectedEquipment.allocate_towers;
        } else {
            this.storageTypes = ['box', 'shelf'];
        }
    }
    onSelectTower(): void {
        this.newForm.get('id') ? this.newForm.get('id').setValue(null) : console.log();
        this.selectedType = null;
    }
    onSelectStorageType(): void{
        this.newForm.get('id') ? this.newForm.get('id').setValue(null) : console.log();
        if (this.isTower) {
            this.allocateNumbers = this.selectedTower ? this.selectedTower.allocate_numbers.filter(s => s.storage_type === this.selectedType) : [];
        } else {
            this.allocateNumbers = this.selectedEquipment ? this.selectedEquipment.allocate_numbers.filter(s => s.storage_type === this.selectedType) : [];
        }
    }
    getEquipments(): void {
        const filter = {
            database: this.selectedDatabase.id,
            storage_temperature: this.selectedTemperature.id
        };
        this.api.storageLocation.getEquipmentWithBox().filter(filter).promise().then(resp => {
            this.equipments  = resp;
        });
    }
    close(): void {
        this.dialogRef.close();
    }
    submit(): void {
        this.dialogRef.close({location: this.newForm.value.id});
    }
    edit(): void {
        this.dialogRef.close();
        this.dialog.open(NewStorageLocationComponent, {data: {location: this.newForm.value.id}});
    }
    delete(): void {
        this.api.storageLocation.deleteStorageLocation(this.newForm.value.id).promise().then(resp => {
           this.dialogRef.close();
           this.snackBar.open(`Delete Storage Location successfully`, 'Success', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
        });
    }
}
