import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '@fuse/animations';
import {ApiService} from '../../../../@fuse/api/api.service';
import {User} from '../../../models/user';
import {MeService} from '../../../../@fuse/services/me.service';
import {FileManagerService} from './file-manager.service';
import {FuseProgressBarService} from '../../../../@fuse/components/progress-bar/progress-bar.service';
import {MatDialog} from '@angular/material/dialog';
import {AddFolderComponent} from './add-folder/add-folder.component';
import {ActivatedRoute} from '@angular/router';
import { Subject } from 'rxjs';


@Component({
    selector: 'file-manager',
    templateUrl: './file-manager.component.html',
    styleUrls: ['./file-manager.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FileManagerComponent implements OnInit, OnDestroy {
    selected: any;
    currentDirKey: string;
    ownerRoutDirKey: string;
    isRouteDir = true;
    isShareDir = false;
    isMyStorage = true;
    primaryRouter = ['My Files'];
    pathArr: string[];
    user: User;
    ownerId: number;
    private _unsubscribeAll: Subject<any>;

    
    constructor(
        private me: MeService,
        private api: ApiService,
        private route: ActivatedRoute,
        private progress: FuseProgressBarService,
        private _fileManagerService: FileManagerService,
        private dialog: MatDialog
    ) {
        // Set the private defaults
        this.user = this.me.meUser;
        this.ownerId = parseInt(this.route.snapshot.paramMap.get('id'), 10) || this.user.id;
        this.isMyStorage = this.ownerId === this.user.id;
        this._unsubscribeAll = new Subject();
    }
    
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * On init
     */
    ngOnInit(): void {
        this.selected = null;
        this.pathArr = this.primaryRouter;
        this.parseParams();
    }
    
    parseParams(): void {
        this.route.queryParams.subscribe(params => {
            if (!this.isMyStorage && (!params['key'] || !params['name'])) {
                return;
            }
            this.currentDirKey = params['key'] || `${this.user.folder_name}/private`;
            this.ownerRoutDirKey = params['key'] || `${this.user.folder_name}/private`;
            this.primaryRouter = params['name'] ? [`${params['name']}'s Files`] : ['My Files'];
            if (params['key']) {
                this.isRouteDir = false;
                if (this.currentDirKey.indexOf('share') === 0) {
                    this.pathArr = this.primaryRouter.concat(this.currentDirKey.split('/').slice(1,));
                } else {
                    this.pathArr = this.primaryRouter.concat(this.currentDirKey.split('/').slice(2,));
                }
                this.getFolderList(this.currentDirKey);
            } else {
                this.getRootList();
                this.pathArr = this.primaryRouter;
            }
        });
    }
    
    // getUser(): void {
    //     this.api.me.getUserBuId(this.ownerId).promise().then(resp => {
    //         this.user = resp;
    //     });
    // }
    //
    selectRouter(selected): void {
        this.selected = selected;
        if (this.selected.folder) {
            this.currentDirKey = this.selected.key;
        }
        if (selected.key.split('/')[0] === 'share') {
            this.isShareDir = true;
            this.pathArr = this.primaryRouter.concat(selected.key.split('/').slice(1,));
        } else {
            this.pathArr = this.primaryRouter.concat(selected.key.split('/').slice(2,));
        }
        this.isRouteDir = false;
    }
    
    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this._fileManagerService.setFiles([]);
    }
    
    getRootList(): void {
        this.progress.show();
        this.api.fileManager.getFileList(this.ownerId).promise().then(resp => {
            this._fileManagerService.setFiles(resp);
            this.progress.hide();
        }).catch(e => {
            this.progress.hide();
        });
    }
    
    getFolderList(key): void {
        this.progress.show();
        this.api.fileManager.getFolder(this.ownerId, key).promise().then(resp => {
            this.progress.hide();
            this._fileManagerService.setFiles(resp);
        });
    }
    
    selectPath(path): void {
        if (path === this.primaryRouter[0]) {
            if (this.isMyStorage) {
                this.pathArr = this.primaryRouter;
                this.currentDirKey = `${this.user.folder_name}/private`;
                this.isRouteDir = true;
                this.getRootList();
                return;
            } else {
                this.getFolderList(this.ownerRoutDirKey);
                return;
            }
        }
        this.isRouteDir = false;
        const keyList = this.currentDirKey.split('/');
        const index = keyList.findIndex(p => p === path);
        const newPaths = keyList.slice(0, index + 1);
        const newKey = newPaths.join('/');
        this.currentDirKey = newKey;
        this.pathArr = this.primaryRouter.concat(newKey.split('/').slice(2,));
        this.getFolderList(newKey);
    }
    
    onFileChange(event): void {
        const file = event.target.files.item(0);
        console.log(file, file.size);
        if (file.size > 1024 * 1024 * 100) {
            alert('You can\'t upload file bigger than 100MB');
        }
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);
        this.progress.show();
        this.api.fileManager.uploadFile(this.ownerId, this.currentDirKey, formData).promise().then(resp => {
            this.progress.hide();
            this._fileManagerService.addFile(resp);
        });
    }
    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void {
    }
    
    addNewFolder(): void {
        const dialogRef = this.dialog.open(AddFolderComponent, {
            data: {
                currentDirKey: this.currentDirKey,
                ownerId: this.ownerId
            }
        });
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.folder) {
                this._fileManagerService.addFile(resp.folder);
            }
        });
    }
}
