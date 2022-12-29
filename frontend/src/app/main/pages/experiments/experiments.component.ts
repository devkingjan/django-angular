import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NewDatabaseComponent} from './new-database/new-database.component';
import {NewExperimentComponent} from './new-experiment/new-experiment.component';
import {ApiService} from '../../../../@fuse/api/api.service';
import {ExperimentFilterComponent} from './experiment-filter/experiment-filter.component';
import {CloseExperimentComponent} from './close-experiment/close-experiment.component';
import {User} from '../../../models/user';
import {MeService} from '../../../../@fuse/services/me.service';
import {fuseAnimations} from '../../../../@fuse/animations';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-experiments',
  templateUrl: './experiments.component.html',
  styleUrls: ['./experiments.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ExperimentsComponent implements OnInit {
    headerData: any;
    experimentData: any = [];
    headerItemFlex: any;
    databases: any = [];
    filterColumnName = '';
    filter = {
        column: null,
        sortMode: null,
        searchText: null,
        filterMode: null,
        filterDate: null
    };
    filterModes = {
        equal: 'Equal',
        does_not_equal: 'Does Not Equal',
        begins_with: 'Begins With',
        does_not_begins_with: 'Does Not Begins With',
        end_with: 'End With',
        does_not_end_with: 'Does Not End With',
        contains: 'Contains',
        does_not_contain: 'Does Not Contain'
    };
    selectedTemplateId: any = null;
    expCount = 100;
    pageSize = 10;
    currentPageIndex = 0;
    pageSizeOptions: number[] = [10, 20, 30, 50, 100];
    user: User;
    constructor(
        private route: ActivatedRoute,
        private me: MeService,
        private api: ApiService,
        private dialog: MatDialog,
        private router: Router
    ) {
        this.selectedTemplateId = parseInt(this.route.snapshot.queryParamMap.get('database'), 10) || null;
        this.user = me.meUser;
    }
    
    ngOnInit(): void {
        this.getDbTemplates();
    }
    getExperimentData(): void {
        this.api.experiment.getExpData(this.selectedTemplateId).filter(this.filter).per_page(this.pageSize)
            .page(this.currentPageIndex).promise().then(resp => {
            this.headerData = resp.columns;
            this.experimentData = resp.exp_data;
            this.expCount = resp.count;
            this.checkItemFlex();
        });
    }
    getDbTemplates(): void{
        this.api.experiment.getDbTemplates().promise().then(resp => {
            this.databases = resp;
            if (!this.selectedTemplateId) {
                this.selectedTemplateId = this.databases.length ? this.databases[0].id : null;
            }
            this.getExperimentData();
        });
    }
    onSelectDatabase(): void {
        this.getExperimentData();
    }
    checkItemFlex(): void {
        if (this.headerData.length > 6) {
            this.headerItemFlex = '150px';
        } else {
            this.headerItemFlex = `${Math.floor(100 / this.headerData.length)}`;
        }
    }
    createNewTemplate(): void {
        const dialogRef = this.dialog.open(NewDatabaseComponent, {data: {template: null}});
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.newTemplate) {
                this.selectedTemplateId = result.newTemplate.id;
                this.getDbTemplates();
            }
        });
    }
    editTemplate(): void {
        const selectedTemplate = this.databases.find(d => d.id === this.selectedTemplateId);
        const dialogRef = this.dialog.open(NewDatabaseComponent, {data: {template: selectedTemplate}});
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.updated) {
              this.getDbTemplates();
          }
        });
    }
    createNewExperiment(val = null): void {
        const dialogRef = this.dialog.open(NewExperimentComponent,
            {data: {columns: this.headerData, templateId: this.selectedTemplateId, data: val, databases: this.databases}});
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.create && result.templateId === this.selectedTemplateId) {
              this.experimentData.unshift(result.create);
            }
            if (result && result.update) {
              const updatedDataIndex = this.experimentData.findIndex(d => d.id === result.update.id);
              this.experimentData[updatedDataIndex] = result.update;
            }
        });
    }
    openDataFolder(exp): void {
        this.router.navigate([`/pages/file-manager`], { queryParams: { key: exp.data_folder}});
        
    }
    closeExperiment(val): void {
        const dialogRef = this.dialog.open(CloseExperimentComponent,
            {data: {expData: val}});
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.api.experiment.cancelExpData(result.id).promise().then(resp => {
                    const updatedDataIndex = this.experimentData.findIndex(d => d.id === result.id);
                    this.experimentData[updatedDataIndex].status = 1;
                });
            }
        });
    }
    submitFilterOpen(val): void {
        const dialogRef = this.dialog.open(ExperimentFilterComponent, {data: {column: val}});
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.filter) {
                this.filterColumnName = val.name;
                this.filter = {
                    column: val.id,
                    ...result.filter
                };
                this.getExperimentData();
            }
        });
    }
    updatedPage(e): void {
        this.currentPageIndex = e.pageIndex;
        this.pageSize = e.pageSize;
        this.getExperimentData();
    }
    resetFilter(): void {
        this.filter = {
            column: null,
            sortMode: null,
            searchText: null,
            filterMode: null,
            filterDate: null
        };
        this.getExperimentData();
    }
}
