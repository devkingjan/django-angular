import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {PositionValidatorService} from '../../../../../@fuse/services/position-validator.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-sample-location',
    templateUrl: './sample-location.component.html',
    styleUrls: ['./sample-location.component.scss']
})
export class SampleLocationComponent implements OnInit, OnChanges {
    @Input() sampleData: any;
    @Input() storageTemperatures: any;
    @Input() databaseId: any;
    @Input() submitted: any;
    @Output() next = new EventEmitter();
    newForm: FormGroup;
    isTower = false;
    isBox = false;
    databases: any = [];
    selectedTemperature: any = null;
    equipments: any = [];
    selectedEquipment: any = null;
    storageTypes: any = ['box', 'shelf'];
    selectedType: any = null;
    allocateNumbers: any = [];
    allocateTowers: any = [];
    selectedTower: any = null;
    range = '';
    
    constructor(
        private positionValidator: PositionValidatorService,
        private _formBuilder: FormBuilder,
        private snackbar: MatSnackBar,
        private api: ApiService
    ) {
    }
    
    ngOnInit(): void {
    
    }
    
    ngOnChanges(changes: SimpleChanges): void {
        const sampleData = changes.sampleData ? changes.sampleData.currentValue : null;
        this.storageTemperatures = changes.storageTemperatures ? changes.storageTemperatures.currentValue : null;
        this.newForm = this._formBuilder.group({
            id: [null, Validators.required],
            position: [null, Validators.required],
        });
        this.subscribeChange();
        if (sampleData) {
            setTimeout(() => {
                this.initialEdit();
            }, 100);
        }
        
    }
    
    initialEdit(): void {
        this.selectedTemperature = this.storageTemperatures.find(s => s.id === this.sampleData.location.storage_temperature);
        const locationId = this.sampleData.location.id;
        const position = this.sampleData.location.position;
        const filter = {
            database: this.databaseId,
            storage_temperature: this.sampleData.location.storage_temperature
        };
        this.api.storageLocation.getEquipmentWithBox().filter(filter).promise().then(resp => {
            this.equipments = resp;
            this.api.storageLocation.getStorageLocation().filter({id: locationId}).promise().then(res => {
                this.selectedEquipment = this.equipments.find(e => e.id === res.equipment);
                this.onSelectEquipment();
                this.selectedTower = this.selectedEquipment.is_tower ? this.allocateTowers.find(t => t.allocate_tower === res.allocate_tower) : null;
                this.selectedType = res.storage_type;
                this.onSelectStorageType();
                if (this.selectedType === 'box') {
                    this.newForm = this._formBuilder.group({
                        id: [locationId, Validators.required],
                        position: [position, Validators.required],
                    });
                } else {
                    this.newForm = this._formBuilder.group({
                        id: [locationId, Validators.required],
                    });
                }
                
                this.subscribeChange();
            });
        });
    }
    
    subscribeChange(): void {
        this.newForm.valueChanges.subscribe(change => {
            if (!change.id) {
                return;
            }
            const locationId = change.id;
            const location = this.allocateNumbers.find(a => a.id === locationId);
            const positionRange = this.positionValidator.getRange(location);
            this.range = `${positionRange[0]} - ${positionRange[1]}`;
        });
    }
    
    onSelectTemperature(): void {
        this.newForm.get('id') ? this.newForm.get('id').setValue(null) : null;
        this.selectedEquipment = null;
        this.selectedTower = null;
        this.selectedType = null;
        this.range = '';
        const filter = {
            database: this.databaseId,
            storage_temperature: this.selectedTemperature.id
        };
        this.api.storageLocation.getEquipmentWithBox().filter(filter).promise().then(resp => {
            this.equipments = resp;
        });
    }
    
    onSelectEquipment(): void {
        this.newForm.get('id') ? this.newForm.get('id').setValue(null) : null;
        this.selectedTower = null;
        this.selectedType = null;
        this.allocateNumbers = [];
        this.range = '';
        this.isTower = this.selectedEquipment.is_tower;
        if (this.selectedEquipment.is_tower) {
            this.storageTypes = ['box'];
            this.allocateTowers = this.selectedEquipment.allocate_towers;
        } else {
            this.storageTypes = ['box', 'shelf'];
        }
    }
    
    onSelectTower(): void {
        this.newForm.get('id') ? this.newForm.get('id').setValue(null) : null;
        this.selectedType = null;
    }
    
    onSelectStorageType(): void {
        this.newForm.get('id') ? this.newForm.get('id').setValue(null) : null;
        if (this.isTower) {
            this.allocateNumbers = this.selectedTower ? this.selectedTower.allocate_numbers.filter(s => s.storage_type === this.selectedType) : [];
        } else {
            this.allocateNumbers = this.selectedEquipment ? this.selectedEquipment.allocate_numbers.filter(s => s.storage_type === this.selectedType) : [];
        }
        this.isBox = this.selectedType === 'box';
        if (this.isBox) {
            this.newForm = this._formBuilder.group({
                id: [this.newForm.value.id, Validators.required],
                position: [this.newForm.value.position, Validators.required],
            });
            this.subscribeChange();
        } else {
            this.newForm = this._formBuilder.group({
                id: [this.newForm.value.id, Validators.required],
                position: [this.newForm.value.position, []],
            });
            this.subscribeChange();
        }
    }
    
    onSelectAllocateNumber(val): void {
        const locationId = val.target.innerText;
        if (locationId !== ' ') {
        
        }
    }
    
    validatePosition(): void {
        const locationId = this.newForm.value.id;
        const location = this.allocateNumbers.find(a => a.id === locationId);
        const position = this.newForm.value.position;
        if (this.sampleData) {
            if (this.sampleData.location.position === position) {
                return;
            }
        }
        const valid = this.positionValidator.validatePosition(location, position);
        if (!valid) {
            this.newForm.get('position').setValue(null);
        }
        this.api.storageLocation.validateLocation({id: locationId, position}).promise().then(resp => {
            if (resp && !resp.valid) {
                this.newForm.get(`position`).setValue(null);
                this.snackbar.open(`Position ${position} already exist`, 'Failed');
            }
        });
    }
    
    setMultiVialLocation(): void {
        this.next.emit(this.newForm);
    }
}
