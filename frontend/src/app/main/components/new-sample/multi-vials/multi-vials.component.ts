import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StorageLocation} from '../../../../models/location';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {PositionValidatorService} from '../../../../../@fuse/services/position-validator.service';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-multi-vials',
  templateUrl: './multi-vials.component.html',
  styleUrls: ['./multi-vials.component.scss']
})
export class MultiVialsComponent implements OnInit, OnChanges {
    @Input() storageTemperatures: any;
    @Input() databaseId: any;
    @Input() submitted: any;
    @Output() submitMulti = new EventEmitter();
    newForm: FormGroup;
    isTower = false;
    allocateTowersForVial: any = [];
    vialNumber: any = null;
    vials = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    selectedTemperatureForVial: any = null;
    selectedEquipmentForVial: any = null;
    equipmentsForVial: any = [];
    vialLocations: StorageLocation[] = [];
    storageTypes: any = ['box', 'shelf'];
    range = {};
    constructor(
        private positionValidator: PositionValidatorService,
        private _formBuilder: FormBuilder,
        private snackbar: MatSnackBar,
        private api: ApiService,
    ) { }
    
    ngOnInit(): void {
    }
    subscribeChange(): void{
        this.newForm.valueChanges.subscribe(change => {
            Object.entries(change).forEach(([key, value]) => {
               if (key.startsWith('allocate_number') && value) {
                   const vial = this.vialLocations[parseInt(key.slice(15, ), 10)];
                   const location = vial.allocateNumbers.find(a => a.id === value);
                   const positionRange = this.positionValidator.getRange(location);
                   if (positionRange) {
                        this.range = `${positionRange[0]} - ${positionRange[1]}`;
                        vial.positionTitle = 'Positions:' + this.range;
                   }
                   
               }
            });
            
        });
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.newForm = this._formBuilder.group({
            storage_type: [null, Validators.required],
            allocate_tower: [null, []],
            allocate_number: [null, Validators.required],
        });
    }
    onSelectTower(vial): void {
        vial.storage_type = null;
        vial.allocate_number = null;
        vial.allocateNumbers = [];
    }
    onSelectStorageTypeForVial(vial, index): void {
        if (!this.selectedEquipmentForVial) {
            return;
        }
        this.newForm.get(`allocate_number${index}`) ? this.newForm.get(`allocate_number${index}`).setValue(null) : null;
        if (this.selectedEquipmentForVial.is_tower) {
            vial.allocateNumbers = vial.allocate_tower ? vial.allocate_tower.allocate_numbers.filter(s => s.storage_type === vial.storage_type) : console.log('None');
        } else {
            vial.allocateNumbers = this.selectedEquipmentForVial.allocate_numbers.filter(s => s.storage_type === vial.storage_type);
        }
        const isBox = vial.storage_type === 'box';
        if (!isBox) {
            this.newForm.get(`position${index}`) ? this.newForm.get(`position${index}`).setValue('null') : console.log();
        } else {
            this.newForm.get(`position${index}`) ? this.newForm.get(`position${index}`).setValue(null) : console.log();
        }
    }
    onUpdateVialNumber(): void {
        this.vialLocations = [];
        const formConfig = {};
        for (let i = 0; i < this.vialNumber; i++) {
            const vial = new StorageLocation(this.databaseId);
            this.vialLocations.push(vial);
            formConfig[`allocate_number${i}`] = [null, [Validators.required]];
            formConfig[`position${i}`] = [null, [Validators.required]];
        }
        this.newForm = this._formBuilder.group({
            disabled_position: [{value: null, disabled: true}, []],
            ...formConfig
        });
        this.subscribeChange();
    }
    onSelectTemperatureForVial(): void {
        const filter = {
            database: this.databaseId,
            storage_temperature: this.selectedTemperatureForVial.id
        };
        this.api.storageLocation.getEquipmentWithBox().filter(filter).promise().then(resp => {
            this.equipmentsForVial  = resp;
        });
    }
    onSelectEquipmentForVial(): void {
        this.newForm.get('allocate_number') ? this.newForm.get('allocate_number').setValue(null) : null;
        this.vialLocations.forEach(vial => {
            vial.allocate_tower = null;
            vial.storage_type = null;
            vial.allocate_number = null;
            vial.allocateNumbers = [];
        });
        this.isTower = this.selectedEquipmentForVial.is_tower;
        if (this.selectedEquipmentForVial.is_tower) {
            this.storageTypes = ['box'];
            this.allocateTowersForVial = this.selectedEquipmentForVial.allocate_towers;
        } else {
            this.storageTypes = ['box', 'shelf'];
        }
    }
    validatePosition(vial, index): void{
        vial.checkPosition = true;
        const locationId = this.newForm.value[`allocate_number${index}`];
        const location = vial.allocateNumbers.find(a => a.id === locationId);
        const position = this.newForm.value[`position${index}`];
        const valid = this.positionValidator.validatePosition(location, position);
        if (!valid) {
            this.newForm.get(`position${index}`).setValue(null);
        }
        vial.checkPosition = true;
        this.api.storageLocation.validateLocation({id: locationId, position}).promise().then(resp => {
            vial.checkPosition = false;
            if (resp && !resp.valid) {
                this.newForm.get(`position${index}`).setValue(null);
                this.snackbar.open(`Position ${position} already exist`, 'Failed');
            }
        });
    }
    submitForm(): void {
        if (!this.validateLocation()) {
            this.snackbar.open(`Same location exist, please check again`, 'Failed');
            return;
        }
        this.submitMulti.emit({form: this.newForm, vialNumber: this.vialNumber});
    }
    validateLocation(): boolean{
        const existing = [];
        for (let i = 0; i < this.vialNumber; i++) {
            if (this.vialLocations[i].storage_type === 'shelf') {
                continue;
            }
            const location = {
                allocateNumber: this.newForm.value[`allocate_number${i}`],
                position: this.newForm.value[`position${i}`]
            };
            const same = existing.filter(e => e.allocateNumber === location.allocateNumber && e.position === location.position);
            if (same.length) {
                return false;
            } else {
                existing.push(location);
            }
        }
        return true;
    }
}
