import {Component, Inject, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {User} from "../../../../models/user";
import {FuseProgressBarService} from "../../../../../@fuse/components/progress-bar/progress-bar.service";

@Component({
    selector: 'app-add-folder',
    templateUrl: './add-folder.component.html',
    styleUrls: ['./add-folder.component.scss']
})
export class AddFolderComponent implements OnInit {
    
    newForm: FormGroup;
    ownerId: number;
    currentDirKey: string;
    submitted = false;
    
    constructor(
        private api: ApiService,
        private progress: FuseProgressBarService,
        public dialogRef: MatDialogRef<AddFolderComponent>,
        private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.currentDirKey = data.currentDirKey;
        this.ownerId = data.ownerId;
        this.newForm = this.formBuilder.group({
            name: ['', [Validators.required]]
        });
    }
    
    ngOnInit(): void {
    }
    
    submit(): void {
        this.progress.show();
        this.submitted = true;
        this.api.fileManager.addFolder(this.ownerId, this.currentDirKey, this.newForm.value).promise().then(resp => {
            this.progress.hide();
            this.submitted = false;
            this.dialogRef.close({folder: resp});
        }).catch(e => {
            this.progress.hide();
            this.submitted = false;
        });
        
    }
    
}
