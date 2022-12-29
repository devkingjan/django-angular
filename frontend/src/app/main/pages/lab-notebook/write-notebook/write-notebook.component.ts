import {
    Component,
    OnInit,
    AfterViewInit,
    ViewEncapsulation,
    NgZone,
    ElementRef,
    ViewChild,
    HostListener
} from '@angular/core';
import {fuseAnimations} from '@fuse/animations';
import {MatDialog} from '@angular/material/dialog';
import {FuseConfigService} from '@fuse/services/config.service';
import {LabESign, LabSectionData} from 'app/models/lab-write';
import {LabWriteESignComponent} from '../../../components/lab-write-e-sign/lab-write-e-sign.component';
import {AssignTeamComponent} from '../../../components/assign-team/assign-team.component';
import {LabWriteChooseImgComponent} from '../../../components/lab-write-choose-img/lab-write-choose-img.component';
import {UploadImageComponent} from '../../profile/upload-image/upload-image.component';
import {labNotebookSection} from 'app/const';
import {MeService} from '@fuse/services/me.service';
import {User} from 'app/models/user';
import Quill from 'quill';
import * as quillBetterTable from 'quill-better-table';
import {ApiService} from '@fuse/api/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FuseProgressBarService} from '@fuse/components/progress-bar/progress-bar.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Observable} from 'rxjs';
import {LabFileViewerComponent} from '../../../components/lab-file-viewer/lab-file-viewer.component';


@Component({
    selector: 'app-write-notebook',
    templateUrl: './write-notebook.component.html',
    styleUrls: ['./write-notebook.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class WriteNotebookComponent implements OnInit, AfterViewInit {
    // theme value
    isDark = false;
    isBlind = false;
    fuseConfig: any;

    user: User;

    sectionTypes = labNotebookSection;

    BUTTON_FOLDER = 1;
    BUTTON_PEN = 2;
    BUTTON_GROUP = 3;

    ADD_ITEM_PLATE = 4;
    ADD_ITEM_LINK = 5;
    ADD_ITEM_IMG = 6;
    ADD_ITEM_TABLE = 7;
    ADD_ITEM_TEXT = 8;

    selectedButton = 0;
    selectedItem = 0;

    direction = 'up';
    fixed = false;

    eSign: any;

    quill: any;

    experiments: any[] = [];
    selectedExperiment: any;
    selectedExpTitle: string;
    selectedExpDate: string;
    selectedExpType: string;

    experimentVersions: any[] = [];
    selectedExperimentVersion: any;

    experimentEntries: any[] = [];
    experimentFileEntries: any[] = [];

    sectionDisabled = false;
    edited = false;

    drop(event: CdkDragDrop<string[]>): void {
        moveItemInArray(this.experimentEntries, event.previousIndex, event.currentIndex);
    }

    constructor(
        private dialog: MatDialog,
        private _fuseConfigService: FuseConfigService,
        private me: MeService,
        private zone: NgZone,
        private api: ApiService,
        private _snackBar: MatSnackBar,
        private progress: FuseProgressBarService,
    ) {
        this._fuseConfigService.config.subscribe((config) => {
            this.fuseConfig = config;
            this.isDark = this.fuseConfig.colorTheme === 'theme-blue-gray-dark';
            this.isBlind = this.fuseConfig.colorTheme === 'theme-yellow-light';
            this.me.getUser
                .pipe()
                .subscribe((user) => {
                    this.user = user;
                });
        });
    }

    // @HostListener allows us to also guard against browser refresh, close, etc.
    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        // insert logic to check if there are pending changes here;
        // returning true will navigate without confirmation
        // returning false will show a confirm dialog before navigating away
        return !this.edited;
    }

    ngOnInit(): void {
        this.getExperiments();
    }

    ngAfterViewInit(): void {
        Quill.register({
            'modules/better-table': quillBetterTable
        }, true);

        this.zone.runOutsideAngular(() => {
            this.quill = new Quill('#editable', {
                    theme: 'snow',
                    modules: {
                        'table': false,
                        'better-table': {
                            operationMenu: {
                                items: {
                                    unmergeCells: {
                                        text: 'Another unmerge cells name'
                                    }
                                },
                                color: {
                                    colors: ['green', 'red', 'yellow', 'blue', 'white'],
                                    text: 'Background Colors:'
                                }
                            }
                        },
                        'keyboard': {
                            bindings: quillBetterTable.keyboardBindings
                        },
                        'toolbar': [
                            [{header: [1, 2, 3, 4, 5, 6, false]}],
                            [{color: []}, {background: []}],          // dropdown with defaults from theme
                            [{font: []}],
                            ['bold', 'italic', 'underline'],        // toggled buttons
                            [{align: []}],
                            [{list: 'ordered'}, {list: 'bullet'}],
                            [{indent: '-1'}, {indent: '+1'}],          // outdent/indent
                            [{script: 'sub'}, {script: 'super'}],      // superscript/subscript
                            [{direction: 'rtl'}],                         // text direction

                            ['blockquote', 'code-block'],

                            ['clean']
                        ]
                    }
                }
            );
        });

        this.quill.on('text-change', (delta, oldDelta, source) => {
            if (source === 'user') {
                this.experimentEntries.forEach(item => {
                    if (item.type === labNotebookSection.notebook) {
                        item.data = this.quill.root.innerHTML;
                    }
                });
                this.edited = true;
            }
        });
    }

    getFilePath(): void {
        if (this.selectedExperiment) {
            this.selectedButton = this.BUTTON_FOLDER;

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

    // e-sign view
    confirmESign(): void {
        if (this.selectedExperiment) {
            if (this.sectionDisabled) {
                this._snackBar.open('This experiment is already signed.', 'Undo', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                });
            } else {
                this.selectedButton = this.BUTTON_PEN;

                const eSignVal = new LabESign();
                eSignVal.expId = this.selectedExperiment.id;
                const dialogRef = this.dialog.open(LabWriteESignComponent, {data: {eSignVal}});
                dialogRef.afterClosed().subscribe(resp => {
                    if (resp && resp.detail) {
                        this._snackBar.open(resp.detail, 'Undo', {
                            duration: 3000,
                            horizontalPosition: 'right',
                            verticalPosition: 'top',
                        });
                        if (!resp.error) {
                            this.getExperiments();
                            this.sectionDisabled = true;
                        }
                    }
                });
            }
        } else {
            this._snackBar.open('Please select experiment to sign.', 'Undo', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
        }
    }

    findGroup(): void {
        if (this.selectedExperiment) {
            this.selectedButton = this.BUTTON_GROUP;

            const teamDialogRef = this.dialog.open(AssignTeamComponent, {data: this.selectedExperiment.id});
            teamDialogRef.afterClosed().subscribe(resp => {
                if (resp && resp.detail) {
                    this._snackBar.open(resp.detail, 'Undo', {
                        duration: 3000,
                        horizontalPosition: 'right',
                        verticalPosition: 'top',
                    });
                    this.getExperiments();
                }
            });
        } else {
            this._snackBar.open('Please select experiment to assign.', 'Undo', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
        }
    }

    getExperiments(): void {
        this.api.experiment.getExperiments({user_id: this.user.id}).promise().then(resp => {
            this.experiments = resp;
        });
    }

    onSelectExperiment(expId): void {
        this.experimentFileEntries = [];

        let result = true;
        if (this.edited && !this.sectionDisabled) {
            result = confirm('IGOR says: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
        }
        if (result) {
            this.selectedExpTitle = '';
            this.selectedExpDate = '';
            this.selectedExpType = '';
            this.selectedExperiment = this.experiments.find(item => {
                if (item.id === expId) {
                    return item;
                }
            });
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
                this.sectionDisabled = true;
                this.quill.enable(false);
            } else {
                this.sectionDisabled = false;
                this.quill.enable(true);
            }

            this.getExperimentDetails(expId);
            this.getExperimentVersion(expId);
        }
    }

    getExperimentDetails(expId): void {
        this.api.experiment.getExperimentDetails(expId).promise().then(resp => {
            this.experimentEntries = resp.entries;
            if (this.experimentEntries.length === 0) {
                this.experimentEntries.push({
                    username: this.user.first_name + ' ' + this.user.last_name,
                    type: this.sectionTypes.notebook,
                    data: '',
                    date: new Date()
                });
            }

            this.experimentEntries.forEach(item => {
                if (item.type === labNotebookSection.notebook) {
                    this.quill.root.innerHTML = item.data;
                }
            });
        });
    }

    getExperimentVersion(expId): void {
        this.api.experiment.getExperimentVersion({experiment: expId}).promise().then(resp => {
            this.experimentVersions = resp;
        });
    }

    onSelectExperimentVersion(expVersionId): void {
        this.selectedExperimentVersion = this.experimentVersions.find(item => {
            if (item.id === expVersionId) {
                return item;
            }
        });
    }

    onRestoreExpVersion(expVersionId): void {
        let result = true;
        if (this.edited) {
            result = confirm('IGOR says: You have unsaved changes. Press Cancel to go back and save these changes, or OK to lose these changes.');
        }
        if (result) {
            this.experimentFileEntries = [];

            this.api.experiment.getExperimentEntryVersion({experiment_version: expVersionId}).promise()
                .then(resp => {
                    this.experimentEntries = resp;

                    if (this.experimentEntries.length) {
                        this.experimentEntries.forEach(item => {
                            if (item.type === labNotebookSection.notebook) {
                                this.quill.root.innerHTML = item.data;
                            }
                        });
                    } else {
                        this.quill.root.innerHTML = '';
                    }
                });
        }
    }

    // extra add functions
    addPlate(): void {
        this.selectedItem = this.ADD_ITEM_PLATE;
    }

    addLink(files: FileList): void {
        this.experimentEntries.push({
            username: this.user.first_name + ' ' + this.user.last_name,
            type: this.sectionTypes.file,
            data: files[0],
            file_name: files[0].name,
            created_at: new Date()
        });
        this.fixed = false; // Remove add sections box after selected
        this.edited = true;
    }

    addTable(): void {
        this.selectedItem = this.ADD_ITEM_TABLE;

        this.experimentEntries.push({
            username: this.user.first_name + ' ' + this.user.last_name,
            type: this.sectionTypes.table,
            data: '',
            created_at: new Date()
        });
        this.fixed = false; // Remove add sections box after selected
        this.edited = true;
    }

    addTextBox(): void {
        this.selectedItem = this.ADD_ITEM_TEXT;

        this.experimentEntries.push({
            username: this.user.first_name + ' ' + this.user.last_name,
            type: this.sectionTypes.textBox,
            data: '',
            created_at: new Date()
        });
        this.fixed = false; // Remove add sections box after selected
        this.edited = true;
    }

    addImage(): void {
        this.selectedItem = this.ADD_ITEM_IMG;

        const dialogRef = this.dialog.open(LabWriteChooseImgComponent);
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.imgPath) {
                if (resp.imgPath === 'pc') {
                    const imgDialogRef = this.dialog.open(UploadImageComponent);
                    imgDialogRef.afterClosed().subscribe((response) => {
                        if (response && 'avatar' in response) {
                            this.experimentEntries.push({
                                username: this.user.first_name + ' ' + this.user.last_name,
                                type: this.sectionTypes.image,
                                data: '',
                                file_source: response.avatar,
                                created_at: new Date()
                            });
                            this.edited = true;
                        }
                    });
                }
            }
        });
        this.fixed = false; // Remove add sections box after selected
    }

    // add some functions on editor
    addSomeItem(): void {
        this.selectedItem = 0;
        this.fixed = !this.fixed;
    }

    onDeleteSection(index): void {
        this.experimentEntries.splice(index, 1);
        this.edited = true;
    }

    onEditSection(data): void {
        this.experimentEntries[data.index] = data.data;
        this.edited = true;
    }

    onHandleSave(): void {
        if (this.selectedExperiment && !this.sectionDisabled) {
            this.progress.show();
            for (let i = 0; i < this.experimentEntries.length; i++) {
                this.experimentEntries[i].order = i + 1;

                if (this.experimentEntries[i].type === labNotebookSection.file) {
                    if (!this.experimentEntries[i].id) {
                        const file = this.experimentEntries[i].data;
                        this.experimentFileEntries.push(file);
                        this.experimentEntries[i].data = file.name;
                    }
                }
            }

            const formData = new FormData();
            formData.append('data', JSON.stringify(this.experimentEntries));
            this.experimentFileEntries.forEach(item => {
                formData.append('files[]', item);
            });
            this.api.experiment.updateExperiment(this.selectedExperiment.id, formData).promise().then(resp => {
                this.progress.hide();
                this._snackBar.open('Experiment Entries are updated', 'Undo', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                });
                this.getExperimentVersion(this.selectedExperiment.id);
                this.edited = false;
            });
        } else {
            if (!this.selectedExperiment) {
                this._snackBar.open('Please select experiment to save.', 'Undo', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                });
            } else {
                this._snackBar.open('Selected experiment is not allowed to edit.', 'Undo', {
                    duration: 3000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                });
            }
        }
    }
}
