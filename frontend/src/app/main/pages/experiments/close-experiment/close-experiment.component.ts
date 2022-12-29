import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-close-experiment',
  templateUrl: './close-experiment.component.html',
  styleUrls: ['./close-experiment.component.scss']
})
export class CloseExperimentComponent implements OnInit {
    expData: any;
    constructor(
        public dialogRef: MatDialogRef<CloseExperimentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
         this.expData = data.expData;
    }

  ngOnInit(): void {
  }

}
