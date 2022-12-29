import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatRippleModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';

import {FuseSharedModule} from '@fuse/shared.module';
import {FuseSidebarModule} from '@fuse/components';
import {FileManagerComponent} from './file-manager.component';
import {FileManagerService} from './file-manager.service';
import {FileManagerFileListComponent} from './file-list/file-list.component';
import {FileManagerDetailsSidebarComponent} from './sidebars/details/details.component';
import {FileManagerMainSidebarComponent} from './sidebars/main/main.component';
import {AddFolderComponent} from './add-folder/add-folder.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';


const routes: Routes = [
    {
        path: '**',
        component: FileManagerComponent,
        children: [],
        resolve: {
            files: FileManagerService
        }
    }
];

@NgModule({
    declarations: [
        FileManagerComponent,
        FileManagerFileListComponent,
        FileManagerMainSidebarComponent,
        FileManagerDetailsSidebarComponent,
        AddFolderComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        
        MatButtonModule,
        MatInputModule,
        MatIconModule,
        MatRippleModule,
        MatSlideToggleModule,
        MatTableModule,
        
        FuseSharedModule,
        FuseSidebarModule,
        MatDialogModule,
        MatFormFieldModule,
    ],
    providers: [
        FileManagerService
    ]
})
export class FileManagerModule {
}
