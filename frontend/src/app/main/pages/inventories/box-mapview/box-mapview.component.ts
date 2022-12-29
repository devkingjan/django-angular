import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {StorageLocation} from '../../../../models/location';
import {PositionValidatorService} from '../../../../../@fuse/services/position-validator.service';
import {NewStorageLocationComponent} from '../panel/storage-location-panel/new-storage-location/new-storage-location.component';
import {MatDialog} from '@angular/material/dialog';
import {MeService} from '../../../../../@fuse/services/me.service';
import {User} from '../../../../models/user';
import {fuseAnimations} from '../../../../../@fuse/animations';

@Component({
  selector: 'app-box-mapview',
  templateUrl: './box-mapview.component.html',
  styleUrls: ['./box-mapview.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class BoxMapviewComponent implements OnInit {
    locationId: any;
    user: User;
    isBox = true;
    location: StorageLocation = null;
    sampleData: any = {};
    isRunningNumber = false;
    horizontalItems = [];
    verticalItems = [];
    constructor(
        private positionValidator: PositionValidatorService,
        private route: ActivatedRoute,
        private api: ApiService,
        private me: MeService,
        private dialog: MatDialog
    ) {
        this.user = me.meUser;
        this.locationId = parseInt(this.route.snapshot.paramMap.get('id'), 10) || null;
    }
    ngOnInit(): void {
        this.getSamples();
        this.getLocation();
    }
    getLocation(): void {
        this.api.storageLocation.getStorageLocation().filter({id: this.locationId}).promise().then(resp => {
            this.location = resp;
            this.initializeTable();
        });
    }
    initializeTable(): void{
        this.verticalItems = [];
        this.horizontalItems = [];
        this.isBox = this.location.storage_type === 'box';
        this.isRunningNumber = this.location.define_location === 'by_running_numbers';
        for (let i = 1; i <= this.location.vertical_number; i++) {
            this.horizontalItems.push(i);
        }
        if (this.isRunningNumber) {
            for (let i = 1; i <= this.location.horizontal_number; i++) {
                this.verticalItems.push(i);
            }
        } else {
            this.verticalItems = this.positionValidator.rowArray.slice(0, this.location.horizontal_number);
        }
    }
    getSamples(): void {
        this.api.storageLocation.getSampleByLocation(this.locationId).promise().then(resp => {
            this.sampleData = resp;
        });
    }
    editLocation(): void {
        const dialogRef = this.dialog.open(NewStorageLocationComponent, {data: {location: this.locationId}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.locations) {
                this.getLocation();
            }
        });
    }
}
