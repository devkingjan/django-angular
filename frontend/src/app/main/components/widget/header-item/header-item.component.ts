import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ExperimentHeader} from '../../../../models/experiment-header';
import {FuseConfigService} from '../../../../../@fuse/services/config.service';

@Component({
  selector: 'app-header-item',
  templateUrl: './header-item.component.html',
  styleUrls: ['./header-item.component.scss']
})
export class HeaderItemComponent implements OnInit {
    @Output() submitFilterOpen = new EventEmitter();
    @Input() itemData: ExperimentHeader;
    @Input() selected: boolean;
    imageSrc: string;
    isDark = false;
    isBlind = false;
    fuseConfig: any;
    constructor(
        private _fuseConfigService: FuseConfigService,
    ) { }
    
    ngOnInit(): void {
        this._fuseConfigService.config.subscribe((config) => {
            this.fuseConfig = config;
            this.isDark = this.fuseConfig.colorTheme === 'theme-blue-gray-dark';
            this.isBlind = this.fuseConfig.colorTheme === 'theme-yellow-light';
        });
    }
    
    openFilter(): void {
        this.submitFilterOpen.emit(this.itemData);
    }

}
