import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {MatDialog} from "@angular/material/dialog";
import {NewProjectComponent} from "./new-project/new-project.component";
import {ApiService} from "../../../../@fuse/api/api.service";
import {Member} from "../../../models/member";
import {Project} from "../../../models/project";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-project-manager',
    templateUrl: './project-manager.component.html',
    styleUrls: ['./project-manager.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProjectManagerComponent implements OnInit {
    archived: any = 'active';
    members: Member[] = [];
    projects: Project[] = [];
    status = 'active';
    filter = {
        archived: 'active'
    };
    
    constructor(
        private api: ApiService,
        private dialog: MatDialog,
        private router: Router
    ) {
    }
    
    ngOnInit(): void {
        this.getProjects();
        this.getMembers();
    }
    
    getProjects(): void {
        this.api.project.getProjects().params(this.filter).promise().then(resp => {
            this.projects = resp;
        });
    }
    
    getMembers(): void {
        this.api.member.get().promise().then(resp => {
            this.members = resp.filter(r => r.status === 2);
        });
    }
    
    goToHistoryPage(): void {
        this.router.navigate(['/pages/project-history']);
    }
    
    goToTimeFramePage(): void {
        this.router.navigate(['/pages/project-timeframe']);
    }
    
    viewArchivedProjects(): void {
        if (this.status === 'active') {
            this.filter = {
                archived: 'archived'
            };
            this.status = 'archived';
        } else {
            this.filter = {
                archived: 'active'
            };
            this.status = 'active';
        }
        this.getProjects();
    }
    
    addNewProject(): void {
        const dialogRef = this.dialog.open(NewProjectComponent, {data: {members: this.members, project: null}});
        dialogRef.afterClosed().subscribe(resp => {
            if (resp && resp.project) {
                this.projects.push(resp.project);
            }
        });
    }
    
    deleteProject(project): void {
        this.projects = this.projects.filter(p => p.id !== project.id);
    }
    
}
