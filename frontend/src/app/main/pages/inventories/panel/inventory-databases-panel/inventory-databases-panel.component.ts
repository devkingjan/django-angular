import {Component, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import {NewInventoryDatabaseComponent} from './new-inventory-database/new-inventory-database.component';
import {ApiService} from '../../../../../../@fuse/api/api.service';
import {MeService} from '../../../../../../@fuse/services/me.service';
import {User} from "../../../../../models/user";

@Component({
  selector: 'app-inventory-databases-panel',
  templateUrl: './inventory-databases-panel.component.html',
  styleUrls: ['./inventory-databases-panel.component.scss']
})
export class InventoryDatabasesPanelComponent implements OnInit {
    expanded = true;
    user: User;
    databases = [];
    selectedDatabase: any = null;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    constructor(
        private me: MeService,
        private dialog: MatDialog,
        private api: ApiService
    ) {
        this.user = this.me.meUser;
    }
    
    ngOnInit(): void {
        this.getInventoryDatabases();
    }
    getInventoryDatabases(): void{
        this.api.inventory.getDatabase().promise().then(resp => {
            this.databases = resp;
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
    createDatabase(): void {
        const dialogRef = this.dialog.open(NewInventoryDatabaseComponent, {data: {}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.newDatabase) {
                this.databases.push(resp.newDatabase);
            }
        });
    }
}
