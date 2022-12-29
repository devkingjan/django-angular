import {Component, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../../@fuse/api/api.service';
import {User} from '../../../models/user';
import {MeService} from '../../../../@fuse/services/me.service';
import {Router} from '@angular/router';
import {NewInventoryDatabaseComponent} from '../../pages/inventories/panel/inventory-databases-panel/new-inventory-database/new-inventory-database.component';
import {NewSampleComponent} from '../../pages/inventories/samples/new-sample/new-sample.component';

@Component({
    selector: 'app-mission-inventory',
    templateUrl: './mission-inventory.component.html',
    styleUrls: ['./mission-inventory.component.scss']
})
export class MissionInventoryComponent implements OnInit {
    
    selectedDate = new Date();
    expanded = true;
    databases: any[] = [];
    getResponse = false;
    panelOpenState = false;
    user: User;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    
    constructor(
        private api: ApiService,
        private router: Router,
        private dialog: MatDialog,
        private me: MeService
    ) {
        this.user = this.me.meUser;
    }
    
    ngOnInit(): void {
        this.getInventoryDatabases();
    }
    
    getInventoryDatabases(): void {
        this.api.inventory.getDatabase().promise().then(resp => {
            this.databases = resp;
            setTimeout(() => {
                this.accordion.openAll();
            }, 500);
        });
    }
    
    clickExpand(): void {
        if (this.expanded) {
            this.accordion.closeAll();
        } else {
            this.accordion.openAll();
        }
        this.expanded = !this.expanded;
    }
    
    viewDatabase(database): void {
        this.router.navigate([`/pages/inventories/${database?.id}/samples/read`]);
    }
    
    editDatabase(database): void {
        this.router.navigate([`/pages/inventories/${database?.id}/samples/edit`]);
    }
    
    addNewAntibody(database): void {
        this.api.inventory.getColumns(database.id).promise().then(resp => {
            this.dialog.open(NewSampleComponent, {data: {columns: resp, databaseId: database.id, data: null}});
        });
    }
}
