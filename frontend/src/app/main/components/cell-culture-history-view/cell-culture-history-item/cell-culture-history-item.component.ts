import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CellCultureHistory} from "../../../../models/cell-culture-history";
import {cellCultureEventTypes, cellCultureRemovedReason} from '../../../../const';
import {FuseConfigService} from "../../../../../@fuse/services/config.service";
import {RemoveWithConfirmComponent} from "../../remove-with-confirm/remove-with-confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {ApiService} from "../../../../../@fuse/api/api.service";
import {UtilsService} from "../../../../../@fuse/services/utils.service";

@Component({
    selector: 'app-cell-culture-history-item',
    templateUrl: './cell-culture-history-item.component.html',
    styleUrls: ['./cell-culture-history-item.component.scss']
})
export class CellCultureHistoryItemComponent implements OnInit {
    @Input() cellCultureHistory: CellCultureHistory;
    @Output() delete = new EventEmitter();
    LOG_TYPE_UPDATE_DATE = 0;
    LOG_TYPE_ADD_NEW = 1;
    LOG_TYPE_EVENT = 2;
    LOG_TYPE_UPDATE_LINE = 3;
    LOG_TYPE_REMOVE = 4;
    isDark = false;
    isBlind = false;
    cellCultureEventTypes = {
        log_passage: 'logged passage',
        log_medium_change: 'logged medium change',
        remove_cell_line: 'removed cell line',
        add_note: 'added note',
        log_mycoplasma_test: 'logged mycoplasma test',
        add_culture_medium_additive: 'added culture medium additive',
    };
    cellCultureRemovedReason = {
        no_longer_needed: 'No Longer Needed',
        contaminated: 'Contaminated',
        died: 'Died',
        frozen_down: 'Frozen Down',
        all_used: 'All Used',
        other: 'Other',
    };
    
    constructor(
        private util: UtilsService,
        private api: ApiService,
        private dialog: MatDialog,
        private _fuseConfigService: FuseConfigService,
    ) {
        this._fuseConfigService.config.subscribe((config) => {
            this.isDark = config.colorTheme === 'theme-blue-gray-dark';
            this.isBlind = config.colorTheme === 'theme-yellow-light';
        });
    }
    
    ngOnInit(): void {
    }
    
    removeHistory(history): void {
        const title = `Are you sure you want to delete this cell culture event from your cell culture history?`;
        const dialogRef = this.dialog.open(RemoveWithConfirmComponent, {
            data:
                {description: ``, name: 'delete', title: title}
        });
        dialogRef.afterClosed().subscribe(resp => {
            
            if (resp && resp.confirm) {
                this.api.cellCultureLine.removeCellCultureHistory(history.id,
                    {updated_at: this.util.getStatTime(new Date())}).promise().then(() => {
                    this.delete.emit(history);
                });
            }
        });
    }
    
}
