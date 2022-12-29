import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {fuseAnimations} from '../../../../@fuse/animations';
import {Project} from "../../../models/project";
import {ApiService} from "../../../../@fuse/api/api.service";
import {ProjectTaskHistory} from "../../../models/project-task-history";
import {FuseProgressBarService} from "../../../../@fuse/components/progress-bar/progress-bar.service";
import {Member} from "../../../models/member";
import {Router} from "@angular/router";

@Component({
    selector: 'app-project-history',
    templateUrl: './project-history.component.html',
    styleUrls: ['./project-history.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProjectHistoryComponent implements OnInit {
    projectHistoryByDate: ProjectTaskHistory[] = [];
    members: Member[] = [];
    selectedProject: Project = null;
    page = 0;
    perPage = 15;
    
    constructor(
        private router: Router,
        private progress: FuseProgressBarService,
        private api: ApiService,
    ) {
    }
    
    ngOnInit(): void {
        this.getMembers();
    }
    
    getMembers(): void {
        this.api.member.get().promise().then(resp => {
            this.members = resp;
        });
    }
    
    select(project): void {
        this.selectedProject = project;
        this.page = 0;
        this.getProjectHistory();
    }
    
    getProjectHistory(): void {
        this.progress.show();
        this.api.project.getProjectHistory(this.selectedProject.id)
            .params({page: this.page, per_page: this.perPage}).promise().then(resp => {
            this.progress.hide();
            if (this.page) {
                this.projectHistoryByDate = this.projectHistoryByDate.concat(resp);
            } else {
                this.projectHistoryByDate = resp;
            }
        });
    }
    goProjectPage(): void {
        this.router.navigate(['/pages/project-manager']);
    }
    nextPage(): void {
        this.page += 1;
        this.getProjectHistory();
    }
}
