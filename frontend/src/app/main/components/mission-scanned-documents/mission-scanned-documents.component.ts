import {Component, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../../@fuse/api/api.service';
import {User} from '../../../models/user';
import {MeService} from '../../../../@fuse/services/me.service';
import {Router} from '@angular/router';
import {NewExperimentComponent} from '../../pages/experiments/new-experiment/new-experiment.component';

@Component({
  selector: 'app-mission-scanned-documents',
  templateUrl: './mission-scanned-documents.component.html',
  styleUrls: ['./mission-scanned-documents.component.scss']
})
export class MissionScannedDocumentsComponent implements OnInit {
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
        this.experiments = [1, 2, 3, 4, 5];
        setTimeout(() => {
            this.accordion.openAll();
        }, 500);
    }
    
    clickExpand(): void {
        if (this.expanded) {
            this.accordion.closeAll();
        } else {
            this.accordion.openAll();
        }
        this.expanded = !this.expanded;
    }
    
    viewAndApprove(): void {
    }
    
    openExpDataFolder(): void {
    }
    
    reject(): void {
    }
    
    addNewExperiment(): void {
        this.dialog.open(NewExperimentComponent,
            {data: {columns: [], templateId: null, data: null, databases: this.databases}});
    }
}
