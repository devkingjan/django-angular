import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProjectTaskHistory} from "../../../../models/project-task-history";
import {Member} from "../../../../models/member";

@Component({
    selector: 'app-project-history-view',
    templateUrl: './project-history-view.component.html',
    styleUrls: ['./project-history-view.component.scss']
})
export class ProjectHistoryViewComponent implements OnInit {
    @Input() projectHistoryByDate: ProjectTaskHistory[];
    @Input() members: Member[];
    @Output() nextPage = new EventEmitter();
    
    constructor() {
    }
    
    ngOnInit(): void {
    }
    
    onScroll(): void {
        this.nextPage.emit();
    }
    
}
