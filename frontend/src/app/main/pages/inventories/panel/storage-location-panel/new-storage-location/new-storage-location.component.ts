import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../../../../@fuse/api/api.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CreateItemWithNameComponent} from '../../../../../components/create-item-with-name/create-item-with-name.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FuseProgressBarService} from '../../../../../../../@fuse/components/progress-bar/progress-bar.service';
import {NewEquipmentComponent} from '../new-equipment/new-equipment.component';
import {UtilsService} from "../../../../../../../@fuse/services/utils.service";

@Component({
  selector: 'app-new-storage-location',
  templateUrl: './new-storage-location.component.html',
  styleUrls: ['./new-storage-location.component.scss']
})
export class NewStorageLocationComponent implements OnInit {
    newForm: FormGroup;
    locationId: number;
    databases: any = [];
    storageTemperatures: any = [];
    equipments: any = [];
    storageTypes: any = ['box', 'shelf'];
    rows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    submitted = false;
    isTower = false;
    towerNumbers = [];
    isBox = true;
    constructor(
        private _formBuilder: FormBuilder,
        private api: ApiService,
        private dialog: MatDialog,
        private utilsService: UtilsService,
        public dialogRef: MatDialogRef<NewStorageLocationComponent>,
        private snackBar: MatSnackBar,
        private progressBar: FuseProgressBarService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.locationId = data ? data.location : null;
        this.newForm = this._formBuilder.group({
            database: ['', Validators.required],
            storage_temperature: ['', Validators.required],
            equipment: ['', Validators.required],
            allocate_tower: ['', ],
            storage_type: ['box', Validators.required],
            allocate_number: ['', Validators.required],
            vertical_number: ['', Validators.required],
            horizontal_number: ['', Validators.required],
            define_location: ['', Validators.required],
        });
    }
    
    ngOnInit(): void {
        this.init();
        this.getDatabases();
        this.getStorageTemperatures();
        this.getStorageEquipments();
        if (this.locationId) {
            this.getLocation();
        }
    }
    
    init(): void {
        this.newForm.valueChanges.subscribe(change => {
            const equipment = this.equipments.find(e => e.id === change.equipment);
            if (equipment) {
                this.isTower = equipment.is_tower;
                this.towerNumbers = [];
                if (this.isTower) {
                    for (let i = 1; i < equipment.tower_number + 1; i++) {
                        this.towerNumbers.push(i);
                    }
                }
            }
            if (this.isTower) {
                this.storageTypes = ['box'];
            } else {
                this.storageTypes = ['box', 'shelf'];
            }
            this.isBox = change.storage_type === 'box';
            this.updateFormGroup(this.isBox, this.isTower);
        });
    }
    getLocation(): void {
        this.api.storageLocation.getStorageLocation().filter({id: this.locationId}).promise().then(resp => {
            this.newForm = this._formBuilder.group({
                database: [resp.database, Validators.required],
                storage_temperature: [resp.storage_temperature, Validators.required],
                equipment: [resp.equipment, Validators.required],
                allocate_tower: [resp.allocate_tower, []],
                storage_type: [resp.storage_type, Validators.required],
                allocate_number: [resp.allocate_number, Validators.required],
                vertical_number: [resp.vertical_number, Validators.required],
                horizontal_number: [resp.horizontal_number, Validators.required],
                define_location: [resp.define_location, Validators.required],
            });
        });
    }
    updateFormGroup(isBox: boolean, isTower: boolean): void {
        const initial = this.newForm.value;
        if (isBox) {
            this.newForm = this._formBuilder.group({
                database: [initial.database, Validators.required],
                storage_temperature: [initial.storage_temperature, Validators.required],
                equipment: [initial.equipment, Validators.required],
                allocate_tower: [initial.allocate_tower, isTower ? [Validators.required] : []],
                storage_type: [initial.storage_type, Validators.required],
                allocate_number: [initial.allocate_number, Validators.required],
                vertical_number: [initial.vertical_number, Validators.required],
                horizontal_number: [initial.horizontal_number, Validators.required],
                define_location: [initial.define_location, Validators.required],
            });
        } else {
            this.newForm = this._formBuilder.group({
                database: [initial.database, Validators.required],
                storage_temperature: [initial.storage_temperature, Validators.required],
                equipment: [initial.equipment, Validators.required],
                allocate_tower: [initial.allocate_tower, isTower ? [Validators.required] : []],
                storage_type: [initial.storage_type, Validators.required],
                allocate_number: [initial.allocate_number, Validators.required],
            });
        }
        this.init();
    }
    
    getDatabases(): void {
        this.api.inventory.getDatabase().promise().then(resp => {
            this.databases = resp;
        });
    }
    getStorageTemperatures(): void {
        this.api.storageLocation.getStorageTemperatures().promise().then(resp => {
            this.storageTemperatures = resp;
        });
    }
    getStorageEquipments(): void {
        this.api.storageLocation.getStorageEquipments().promise().then(resp => {
            this.equipments = resp;
        });
    }
    createStorageTemperature(): void {
        const dialogRef = this.dialog.open(CreateItemWithNameComponent);
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.name) {
                this.api.storageLocation.createStorageTemperature({name: resp.name}).promise().then(res => {
                    this.storageTemperatures.push(res);
                    this.newForm.get('storage_temperature').setValue(res.id);
                    this.snackBar.open(`Created new temperature ${resp.name} successfully`, 'success');
                });
            }
        });
    }
    createEquipment(): void {
        const dialogRef = this.dialog.open(NewEquipmentComponent);
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.equipment) {
                this.api.storageLocation.createStorageEquipment(resp.equipment).promise().then(res => {
                    this.equipments.push(res);
                    this.isTower = res.is_tower;
                    this.towerNumbers = [];
                    if (this.isTower) {
                        for (let i = 1; i < res.tower_number + 1; i++) {
                            this.towerNumbers.push(i);
                        }
                    }
                    this.newForm.get('equipment').setValue(res.id);
                    this.snackBar.open(`Created new equipment ${resp.name} successfully`, 'success');
                });
            }
        });
    }
    counter(val: number): any {
    
    }
    submit(): void {
        this.progressBar.show();
        this.submitted = true;
        if (this.locationId) {
            this.api.storageLocation.editStorageLocation(this.locationId, this.newForm.value).promise().then(resp => {
                this.progressBar.hide();
                this.submitted = false;
                this.snackBar.open(`Updated Storage Location successfully`, 'Success', {
                  duration: 3000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                });
                this.dialogRef.close({locations: resp});
            }).catch(error => {
                this.submitted = false;
                this.progressBar.hide();
                const errorMessage = this.utilsService.parseError(error);
                this.snackBar.open(errorMessage, 'Failed', {
                  duration: 3000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                });
            });
        } else {
            this.api.storageLocation.createStorageLocation(this.newForm.value).promise().then(resp => {
                this.progressBar.hide();
                this.submitted = false;
                this.snackBar.open(`Created new Storage Location successfully`, 'Success', {
                  duration: 3000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                });
                this.dialogRef.close({locations: resp});
            }).catch(error => {
                this.submitted = false;
                this.progressBar.hide();
                const errorMessage = this.utilsService.parseError(error);
                this.snackBar.open(errorMessage, 'Failed', {
                  duration: 3000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                });
            });
        }
        
    }

}
