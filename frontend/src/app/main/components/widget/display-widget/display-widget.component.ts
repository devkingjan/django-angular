import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-display-widget',
  templateUrl: './display-widget.component.html',
  styleUrls: ['./display-widget.component.scss']
})
export class DisplayWidgetComponent implements OnInit {
    @Input() widgetName: string;
    constructor() { }
    
    ngOnInit(): void {
    }

}
