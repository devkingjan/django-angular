import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {widgets} from './member-statistic-data';

@Component({
  selector: 'app-member-statistic',
  templateUrl: './member-statistic.component.html',
  styleUrls: ['./member-statistic.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MemberStatisticComponent implements OnInit {
    widgets: any = null;
    widget1SelectedYear = '2016';
    widget5SelectedDay = 'today';
    constructor() {
        this.widgets = widgets;
    }
    
    ngOnInit(): void {
    }

}
