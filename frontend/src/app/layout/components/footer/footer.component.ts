import { Component } from '@angular/core';
import {FuseConfigService} from '../../../../@fuse/services/config.service';

@Component({
    selector   : 'footer',
    templateUrl: './footer.component.html',
    styleUrls  : ['./footer.component.scss']
})
export class FooterComponent
{
    /**
     * Constructor
     */
    isDark = false;
    isBlind = false;
    fuseConfig: any;
    constructor(
        private _fuseConfigService: FuseConfigService,
    )
    {
        this._fuseConfigService.config.subscribe((config) => {
            this.fuseConfig = config;
            this.isDark = this.fuseConfig.colorTheme === 'theme-blue-gray-dark';
            this.isBlind = this.fuseConfig.colorTheme === 'theme-yellow-light';
        });
    }
}
