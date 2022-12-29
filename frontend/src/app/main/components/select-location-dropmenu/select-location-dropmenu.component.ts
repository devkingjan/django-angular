import {Component, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../../../@fuse/api/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-select-location-dropmenu',
  templateUrl: './select-location-dropmenu.component.html',
  styleUrls: ['./select-location-dropmenu.component.scss']
})
export class SelectLocationDropmenuComponent implements OnInit {
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
    expanded = true;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    constructor(
        private api: ApiService,
        private router: Router,
        private _builderForm: FormBuilder,
    ) {
        this.newForm = this._builderForm.group({
            id: ['', Validators.required],
        });
    }
    
    ngOnInit(): void {
        this.getInventoryDatabases();
    }
    getInventoryDatabases(): void{
        this.api.inventory.getDatabase().promise().then(resp => {
            this.databases = resp;
        });
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
    clickExpand(): void {
        this.expanded = !this.expanded;
        if (this.expanded) {
            this.accordion.closeAll();
        } else {
            this.accordion.openAll();
        }
    }
    submit(): void {
        const id = this.newForm.value.id;
        this.router.navigate([`/pages/inventories`]);
        setTimeout(() => {
            this.router.navigate([`/pages/inventories/location/${id}/map-view`]);
        }, 100);
    }
}
