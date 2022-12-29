import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {fuseAnimations} from '@fuse/animations';
import {FileManagerService} from '../../file-manager.service';


@Component({
    selector: 'file-manager-details-sidebar',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    animations: fuseAnimations
})
export class FileManagerDetailsSidebarComponent implements OnInit, OnChanges {
    @Input() selected: any;
    
    /**
     * Constructor
     *
     * @param {FileManagerService} _fileManagerService
     */
    constructor(
    ) {
    }

    /**
     * On init
     */
    ngOnInit(): void {
    }
    
    ngOnChanges(changes: SimpleChanges): void {
    }
    
    getLocation(key): string {
        if (key) {
            const keyArray = key.split('/').slice(2.0);
            return keyArray.join('/');
        } else {
            return null;
        }
    }

}
