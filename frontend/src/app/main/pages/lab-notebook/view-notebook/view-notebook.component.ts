import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '@fuse/animations';
import {FuseConfigService} from '@fuse/services/config.service';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import {MeService} from '@fuse/services/me.service';
import {ApiService} from '@fuse/api/api.service';
import {User} from 'app/models/user';
import {labNotebookSection} from '../../../../const';
import * as moment from 'moment';
import {LabFileViewerComponent} from '../../../components/lab-file-viewer/lab-file-viewer.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-view-notebook',
    templateUrl: './view-notebook.component.html',
    styleUrls: ['./view-notebook.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ViewNotebookComponent implements OnInit {
    // theme value
    isDark = false;
    isBlind = false;
    fuseConfig: any;

    labDocExpanded = false;
    labTableExpanded = false;

    content = `<h1>Interdum ultricies</h1><br><p>Lorem ipsum</p>`;
    sectionTypes = labNotebookSection;

    user: User;
    experiments: any[] = [];
    selectedExperiment: any;
    selectedExpTitle = '';
    selectedExpType = '';
    selectedExpDate = '';
    selectedExpWriteStatus = '';
    selectedExpReviewed = '';
    experimentEntries: any[] = [];
    experimentVersions: any[] = [];
    sectionDisabled = true;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private me: MeService,
        private api: ApiService,
        private dialog: MatDialog,
        private _snackBar: MatSnackBar,
    ) {
        this._fuseConfigService.config.subscribe((config) => {
            this.fuseConfig = config;
            this.isDark = this.fuseConfig.colorTheme === 'theme-blue-gray-dark';
            this.isBlind = this.fuseConfig.colorTheme === 'theme-yellow-light';
        });
        this.me.getUser
            .pipe()
            .subscribe((user) => {
                this.user = user;
            });
    }

    ngOnInit(): void {
        this.getExperiments();
    }

    getExperiments(): void {
        this.api.experiment.getExperiments({user_id: this.user.id}).promise().then(resp => {
            this.experiments = resp;
        });
    }

    getFilePath(): void {
        if (this.selectedExperiment) {
            const dialogRef = this.dialog.open(LabFileViewerComponent, {
                data: {
                    expId: this.selectedExperiment.id,
                    expUid: this.selectedExperiment.uid
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                console.log(`Dialog result: ${result}`);
            });
        } else {
            this._snackBar.open('Please select experiment first.', 'Undo', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
        }
    }

    onDownloadPdf(): void {
        let data;
        data = document.getElementById('lab-viewer');
        html2canvas(data, {useCORS: true, allowTaint: false}).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            const doc = new jspdf('p', 'mm', 'a4');
            let position = 0;

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            doc.save( 'Lab-Viewer.pdf');
        });
    }


    onLabDocExpand(event): void {
        this.labDocExpanded = event;
    }

    onLabTableExpand(event): void {
        this.labTableExpanded = event;
    }

    onSelectedExperiment(event): void {
        this.selectedExperiment = event;
        this.selectedExpTitle = '';
        this.selectedExpDate = '';
        this.selectedExpType = '';
        this.selectedExpWriteStatus = '';
        this.selectedExpReviewed = '';

        this.selectedExperiment.column_data.forEach(item => {
            if (item.column_name === 'Title') {
                this.selectedExpTitle = item.value;
            }
            if (item.column_name === 'Date') {
                this.selectedExpDate = new Date(item.value).toLocaleDateString();
            }
            if (item.column_name === 'Experiment Type') {
                this.selectedExpType = item.option_name;
            }
        });

        if (this.selectedExperiment.sign_date) {
            this.selectedExpWriteStatus = 'Signed off on: '
                + moment(this.selectedExperiment.sign_date).format('MM/DD/YYYY')
                + ' by '
                + this.selectedExperiment.signed_user_info.initials;
        } else {
            this.selectedExpWriteStatus = 'In progress';
        }

        if (this.selectedExperiment.assigned_user) {
            this.selectedExpReviewed = 'Assigned to '
                + this.selectedExperiment.assigned_user_info.initials + '.';
        }

        this.getExperimentDetails(event.id);
        this.getExperimentVersion(event.id);
    }

    getExperimentDetails(expId): void {
        this.api.experiment.getExperimentDetails(expId).promise().then(resp => {
            this.experimentEntries = resp.entries;

            if (this.experimentEntries.length) {
                this.experimentEntries.forEach(item => {
                    if (item.type === labNotebookSection.notebook) {
                        this.content = item.data;
                    }
                });
            } else {
                this.content = '';
            }
        });
    }

    getExperimentVersion(expId): void {
        this.api.experiment.getExperimentVersion({experiment: expId}).promise().then(resp => {
            this.experimentVersions = resp;
        });
    }

    onSelectExpVersion(expVersionId): void {
        this.api.experiment.getExperimentEntryVersion({experiment_version: expVersionId}).promise()
            .then(resp => {
                this.experimentEntries = resp;

                if (this.experimentEntries.length) {
                    this.experimentEntries.forEach(item => {
                        if (item.type === labNotebookSection.notebook) {
                            this.content = item.data;
                        }
                    });
                } else {
                    this.content = '';
                }
            });
    }

}
