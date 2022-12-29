import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ApiService} from "../../../../@fuse/api/api.service";
import {Project} from "../../../models/project";
import {FuseConfigService} from "../../../../@fuse/services/config.service";
import {fuseAnimations} from "../../../../@fuse/animations";
import {Router} from "@angular/router";
import html2canvas from "html2canvas";
import jspdf from "jspdf";

@Component({
    selector: 'app-project-timeline',
    templateUrl: './project-timeline.component.html',
    styleUrls: ['./project-timeline.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProjectTimelineComponent implements OnInit {
    projects: Project[] = [];
    originProjects: Project[] = [];
    filter = {
        archived: 'active'
    };
    
    constructor(
        private api: ApiService,
        private router: Router
    ) {
    }
    
    ngOnInit(): void {
        this.getProjects();
    }
    
    getProjects(): void {
        this.api.project.getProjects().params(this.filter).promise().then(resp => {
            this.projects = resp;
            this.originProjects = Object.assign([], resp);
        });
    }
    
    selectProject(projects): void {
        this.projects = projects;
    }
    
    goProjectPage(): void {
        this.router.navigate(['/pages/project-manager']);
    }
    
    onDownloadPdf(): void {
        let data;
        data = document.getElementById('project-timeframe');
        html2canvas(data, {useCORS: true, allowTaint: false}).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            const doc = new jspdf('p', 'mm', 'a4');
            let position = 0;

            doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            let title = 'All Project Timeframe.pdf';

            if (this.projects.length === 1) {
                title = `${this.projects[0].name}'s tasks Timeframe`;
            }
            doc.save( title);
        });
    }
    
}
