import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {fuseAnimations} from '../../../../@fuse/animations';

@Component({
  selector: 'app-inventories',
  templateUrl: './inventories.component.html',
  styleUrls: ['./inventories.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class InventoriesComponent implements OnInit {
    expanded = true;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    constructor() { }
    
    ngOnInit(): void {
    }
    
    clickExpand(): void {
        this.expanded = !this.expanded;
        if (this.expanded) {
            this.accordion.closeAll();
        } else {
            this.accordion.openAll();
        }
    }

}
