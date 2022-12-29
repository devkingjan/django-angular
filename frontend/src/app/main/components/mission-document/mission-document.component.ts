import {Component, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import {ApiService} from '../../../../@fuse/api/api.service';
import {User} from '../../../models/user';
import {MeService} from '../../../../@fuse/services/me.service';
import {Router} from "@angular/router";
import {NewExperimentComponent} from "../../pages/experiments/new-experiment/new-experiment.component";
import {AddFolderComponent} from "../../pages/file-manager/add-folder/add-folder.component";

@Component({
    selector: 'app-mission-document',
    templateUrl: './mission-document.component.html',
    styleUrls: ['./mission-document.component.scss']
})
export class MissionDocumentComponent implements OnInit {
    expanded = true;
    experiments: any[] = [];
    getResponse = false;
    panelOpenState = false;
    user: User;
    databases: any[] = [];
    files: any[] = [];
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
        this.getFolderList();
        setTimeout(() => {
            this.accordion.openAll();
        }, 500);
    }
    
    getFolderList(): void {
        this.api.fileManager.getFolder(this.user.id, `${this.user.folder_name}/private`).promise().then(resp => {
            this.files = resp.filter(r => (r.name !== 'Experiments' && r.type === 'folder'));
            setTimeout(() => {
                this.accordion.openAll();
            }, 500);
        });
    }
    
    getDbTemplates(): void {
        this.api.experiment.getDbTemplates().promise().then(resp => {
            this.databases = resp;
        });
    }
    
    getRecentExperiments(): void {
        this.api.experiment.getRecentExpData().promise().then(resp => {
            this.experiments = resp;
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
    
    openExpDataFolder(key): void {
        this.router.navigate([`/pages/member/${this.user.id}/storage`],
            {queryParams: {key: key, name: `${this.user.first_name} ${this.user.last_name}`}});
    }
    
    addNewDocument(): void {
        const currentFolder = `${this.user.folder_name}/private`;
        const dialogRef = this.dialog.open(AddFolderComponent, {
            data: {
                currentDirKey: currentFolder,
                ownerId: this.user.id
            }
        });
    }
    
}
