import {Component, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import {NewStorageLocationComponent} from './new-storage-location/new-storage-location.component';
import {ApiService} from '../../../../../../@fuse/api/api.service';
import {ViewStorageLocationComponent} from './view-storage-location/view-storage-location.component';
import {Router} from '@angular/router';
import {MeService} from '../../../../../../@fuse/services/me.service';
import {User} from '../../../../../models/user';

@Component({
  selector: 'app-storage-location-panel',
  templateUrl: './storage-location-panel.component.html',
  styleUrls: ['./storage-location-panel.component.scss']
})
export class StorageLocationPanelComponent implements OnInit {
    user: User;
    expanded = true;
    databases: any = [];
    selectedDatabase: any = null;
    selectedTemperature: any = null;
    
    @ViewChild(MatAccordion) accordion: MatAccordion;
    constructor(
        private me: MeService,
        private api: ApiService,
        private router: Router,
        private dialog: MatDialog
    ) {
        this.user = this.me.meUser;
    }
    
    ngOnInit(): void {
        this.getStorageLocation();
    }
    getStorageLocation(): void {
        this.api.storageLocation.getStorageLocationByTemperature().promise().then(resp => {
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
    createLocation(): void {
        const dialogRef = this.dialog.open(NewStorageLocationComponent, {});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.locations) {
                this.databases = resp.locations;
            }
        });
    }
    viewStorageLocation(mode: string): void {
        const dialogRef = this.dialog.open(ViewStorageLocationComponent,
            {data: {
                mode: mode,
                databases: this.databases,
                database: this.selectedDatabase,
                temperature: this.selectedTemperature
            }}
        );
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.location) {
                this.router.navigate([`/pages/inventories/location/${resp.location}/map-view`]);
            }
        });
    }
}
