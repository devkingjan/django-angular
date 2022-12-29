import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CellCultureEventByDate} from '../../../models/cell-culture-event-by-date';
import {FuseConfigService} from "../../../../@fuse/services/config.service";
@Component({
    selector: 'app-cell-culture-history-view',
    templateUrl: './cell-culture-history-view.component.html',
    styleUrls: ['./cell-culture-history-view.component.scss']
})
export class CellCultureHistoryViewComponent implements OnInit {
    @Input() cellCultureEventByDate: CellCultureEventByDate[];
    @Output() delete = new EventEmitter();
    isDark = false;
    isBlind = false;
    constructor(
        private _fuseConfigService: FuseConfigService,
    ) {
        this._fuseConfigService.config.subscribe((config) => {
            this.isDark = config.colorTheme === 'theme-blue-gray-dark';
            this.isBlind = config.colorTheme === 'theme-yellow-light';
        });
    }
    
    ngOnInit(): void {
    }
    
    deleteHistory(history): void {
        this.delete.emit(history);
    }
}
