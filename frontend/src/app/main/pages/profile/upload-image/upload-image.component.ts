import {Component, Inject, OnInit, Output} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit {
    imageChangedEvent: any = '';
    croppedImage: any = '';
    constructor(
        public dialogRef: MatDialogRef<UploadImageComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
    
    ngOnInit(): void {
    }
    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent): void {
        this.croppedImage = event.base64;
    }
    imageLoaded(): void {
        // show cropper
    }
    cropperReady(): void {
        // cropper ready
    }
    loadImageFailed(): void {
        // show message
    }
    reset(): void {
        this.croppedImage = '';
        this.imageChangedEvent = '';
        // @ts-ignore
        document.getElementById('image').value = '';
    }
    selectImage(): void {
        this.dialogRef.close({avatar: this.croppedImage});
    }
}
