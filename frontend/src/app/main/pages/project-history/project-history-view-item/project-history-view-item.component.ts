import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ProjectTaskEvent} from "../../../../models/project-task-event";
import {Member} from "../../../../models/member";
import {FuseConfigService} from "../../../../../@fuse/services/config.service";

@Component({
    selector: 'app-project-history-view-item',
    templateUrl: './project-history-view-item.component.html',
    styleUrls: ['./project-history-view-item.component.scss']
})
export class ProjectHistoryViewItemComponent implements OnInit, OnChanges {
    @Input() event: ProjectTaskEvent;
    @Input() members: Member[];
    removedMembers: Member[] = [];
    addedMembers: Member[] = [];
    removedProjectMembers: Member[] = [];
    addedProjectMembers: Member[] = [];
    projectStatus = {
        done: 'Done',
        in_progress: 'In Progress',
        in_planing: 'In Planning',
        on_hold: 'On Hold',
    };
    isDark = false;
    isBlind = false;
    
    constructor(
        private _fuseConfigService: FuseConfigService,
    ) {
    }
    
    ngOnInit(): void {
        this._fuseConfigService.config.subscribe((config) => {
            this.isDark = config.colorTheme === 'theme-blue-gray-dark';
            this.isBlind = config.colorTheme === 'theme-yellow-light';
        });
    }
    
    ngOnChanges(changes: SimpleChanges): void {
        const currentEvent = changes.event.currentValue;
        if (currentEvent.type === 'edit_task_members') {
            this.removedMembers = [];
            this.addedMembers = [];
            this.checkAssignMember(currentEvent);
        }
        if (currentEvent.type === 'edit_project_member') {
            this.removedProjectMembers = [];
            this.addedProjectMembers = [];
            this.checkAssignProjectMember(currentEvent);
        }
    }
    
    checkAssignProjectMember(event: ProjectTaskEvent): void {
        const beforeMembers = event.before_project.members;
        const afterMembers = event.after_project.members;
        for (const member of beforeMembers) {
            const index = afterMembers.find(m => m === member);
            if (!index) {
                const memberObj = this.members.find(m => m.id === member);
                this.removedProjectMembers.push(memberObj);
            }
        }
        for (const member of afterMembers) {
            const index = beforeMembers.find(m => m === member);
            if (!index) {
                const memberObj = this.members.find(m => m.id === member);
                this.addedProjectMembers.push(memberObj);
            }
        }
    }
    
    checkAssignMember(event: ProjectTaskEvent): void {
        const beforeMembers = event.before_task.members;
        const afterMembers = event.after_task.members;
        for (const member of beforeMembers) {
            const index = afterMembers.find(m => m === member);
            if (!index) {
                const memberObj = this.members.find(m => m.id === member);
                this.removedMembers.push(memberObj);
            }
        }
        for (const member of afterMembers) {
            const index = beforeMembers.find(m => m === member);
            if (!index) {
                const memberObj = this.members.find(m => m.id === member);
                this.addedMembers.push(memberObj);
            }
        }
    }
    
}
