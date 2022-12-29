import {Component, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {ApiService} from '../../../../../../@fuse/api/api.service';
import {MatDialog} from '@angular/material/dialog';
import {NewSampleComponent} from '../../samples/new-sample/new-sample.component';

@Component({
  selector: 'app-add-new-sample-panel',
  templateUrl: './add-new-sample-panel.component.html',
  styleUrls: ['./add-new-sample-panel.component.scss']
})
export class AddNewSamplePanelComponent implements OnInit {
    expanded = true;
    databases: any = [];
    columns: any = [];
    @ViewChild(MatAccordion) accordion: MatAccordion;
    constructor(
        private api: ApiService,
        private dialog: MatDialog
    ) { }
    
    ngOnInit(): void {
        this.getInventoryDatabases();
    }
    getInventoryDatabases(): void{
        this.api.inventory.getDatabase().promise().then(resp => {
            this.databases = resp;
        });
    }
    createSampleForDatabase(database): void {
        this.api.inventory.getColumns(database.id).promise().then(resp => {
            this.dialog.open(NewSampleComponent, {data: {columns: resp, databaseId: database.id, data: null}});
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

}