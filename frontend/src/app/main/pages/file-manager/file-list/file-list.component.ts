import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {FuseSidebarService} from '@fuse/components/sidebar/sidebar.service';
import {FileManagerService} from '../file-manager.service';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {User} from '../../../../models/user';
import {MeService} from '../../../../../@fuse/services/me.service';
import {FuseProgressBarService} from '../../../../../@fuse/components/progress-bar/progress-bar.service';
import {MatDialog} from '@angular/material/dialog';
import {RemoveWithConfirmComponent} from '../../../components/remove-with-confirm/remove-with-confirm.component';
import {FuseConfigService} from '../../../../../@fuse/services/config.service';


@Component({
    selector: 'file-list',
    templateUrl: './file-list.component.html',
    styleUrls: ['./file-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FileManagerFileListComponent implements OnInit, OnDestroy {
    @Output() select = new EventEmitter();
    @Input() isRouteDir: any;
    files: any;
    isUpdating = false;
    dataSource: FilesDataSource | null;
    displayedColumns = ['icon', 'name', 'type', 'size', 'permission', 'modified', 'permission-button', 'action-button',
        'detail-button'];
    selected: any;
    user: User;
    isDark = false;
    isBlind = false;
    defaultDirs = ['Experiments', 'Protocols-SOPs', 'Templates', 'Buffer-Recipes'];
    
    // Private
    private _unsubscribeAll: Subject<any>;
    
    /**
     * Constructor
     *
     * @param progress
     * @param me
     * @param api
     * @param dialog
     * @param {FileManagerService} _fileManagerService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param _fuseConfigService
     */
    constructor(
        private progress: FuseProgressBarService,
        private me: MeService,
        private api: ApiService,
        private dialog: MatDialog,
        private _fileManagerService: FileManagerService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseConfigService: FuseConfigService,
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.user = this.me.meUser;
    }
    
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * On init
     */
    ngOnInit(): void {
        this._fileManagerService.onFilesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(files => {
                this.dataSource = files;
                this.files = files;
            });
        this._fuseConfigService.config.subscribe((config) => {
            this.isDark = config.colorTheme === 'theme-blue-gray-dark';
            this.isBlind = config.colorTheme === 'theme-yellow-light';
        });
        this._fileManagerService.onFilesAdded
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(file => {
                if (file) {
                    if (file.folder) {
                        this.files.unshift(file);
                    } else {
                        this.files.push(file);
                    }
                    const newFile = Object.assign([], this.files);
                    this._fileManagerService.setFiles(newFile);
                }
            });
        
    }
    
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    
    isDefault(row): boolean {
        if (row.key.split('/')[0] === 'share') {
            return true;
        }
        const permissionDir = row.key.split('/')[2];
        const isDefaultMedia = this.defaultDirs.indexOf(permissionDir) !== -1;
        return isDefaultMedia;
    }
    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * On select
     *
     * @param selected
     */
    onSelect(selected): void {
        if (selected.folder) {
            this.progress.show();
            this.api.fileManager.getFolder(this.user.id, selected.key).promise().then(resp => {
                this.progress.hide();
                this.select.emit(selected);
                this.files = resp;
                this.dataSource = resp;
            });
        } else {
            this.select.emit(selected);
        }
        
    }
    
    updatePermission(row): void {
        this.progress.show();
        this.isUpdating = true;
        this.api.fileManager.updatePermission(this.user.id, row).promise().then(resp => {
            this.isUpdating = false;
            row = resp;
            this.progress.hide();
        }).catch(() => {
            this.isUpdating = false;
            this.progress.hide();
        });
    }
    
    delete(e, row): void {
        e.stopPropagation();
        const title = row.folder ? `Are you sure you want to delete data folder: "${row.name}"?` : `Are you sure you want to delete file: "${row.name}"?`
        const dialogRef = this.dialog.open(RemoveWithConfirmComponent, {
            data:
                {description: ``, name: 'delete', title: title}
        });
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.confirm) {
                this.progress.show();
                this.api.fileManager.deleteKey(this.user.id, {
                    key: row.key,
                    folder: row.folder
                }).promise().then(() => {
                    this.progress.hide();
                    this.files = this.files.filter(f => f.key !== row.key);
                    const newFile = Object.assign([], this.files);
                    this._fileManagerService.setFiles(newFile);
                }).catch(() => {
                    this.progress.hide();
                });
            }
        });
    }
    
    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}

export class FilesDataSource extends DataSource<any> {
    /**
     * Constructor
     *
     * @param {FileManagerService} _fileManagerService
     */
    constructor(
        private _fileManagerService: FileManagerService
    ) {
        super();
    }
    
    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        return this._fileManagerService.onFilesChanged;
    }
    
    /**
     * Disconnect
     */
    disconnect(): void {
    }
}
