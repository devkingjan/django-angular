import {Component, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../../@fuse/api/api.service';
import {User} from '../../../models/user';
import {MeService} from '../../../../@fuse/services/me.service';
import {Router} from "@angular/router";
import {NewInventoryDatabaseComponent} from "../../pages/inventories/panel/inventory-databases-panel/new-inventory-database/new-inventory-database.component";
import {NewSampleComponent} from "../../pages/inventories/samples/new-sample/new-sample.component";
import {NewExperimentComponent} from "../../pages/experiments/new-experiment/new-experiment.component";

@Component({
    selector: 'app-mission-experiment',
    templateUrl: './mission-experiment.component.html',
    styleUrls: ['./mission-experiment.component.scss']
})
export class MissionExperimentComponent implements OnInit {
    expanded = true;
    experiments: any[] = [];
    getResponse = false;
    panelOpenState = false;
    user: User;
    databases: any[] = [];
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
        this.getDbTemplates();
        this.getRecentExperiments();
    }
    
    getDbTemplates(): void {
        this.api.experiment.getDbTemplates().promise().then(resp => {
            this.databases = resp;
        });
    }
    
    getRecentExperiments(): void {
        this.api.experiment.getRecentExpData().promise().then(resp => {
            this.experiments = resp;
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
    
    openWriteUpArea(experiment): void {
        this.router.navigate(['/pages/lab/write-notebook']);
    }
    
    openExpDataFolder(experiment): void {
        this.router.navigate([`/pages/file-manager`], {queryParams: {key: experiment.data_folder}});
    }
    
    viewExperiments(experiment): void {
        this.router.navigate([`/pages/experiments`],
            { queryParams: { database: experiment.template}});
    }
    
    addNewExperiment(): void {
        this.dialog.open(NewExperimentComponent,
            {data: {columns: [], templateId: null, data: null, databases: this.databases}});
    }
}
