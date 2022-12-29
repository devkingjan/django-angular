import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {ApiService} from "../../../../../@fuse/api/api.service";
import {Project} from "../../../../models/project";

@Component({
  selector: 'app-project-history-selection',
  templateUrl: './project-history-selection.component.html',
  styleUrls: ['./project-history-selection.component.scss']
})
export class ProjectHistorySelectionComponent implements OnInit {
    @Output() select = new EventEmitter();
    expanded = true;
    selectedProject: Project;
    projects: Project[] = [];
    getResponse = false;
    panelOpenState = false;
 
    @ViewChild(MatAccordion) accordion: MatAccordion;
    
    constructor(
        private api: ApiService,
        private router: Router,
        private dialog: MatDialog,
    ) {
    }
    
    ngOnInit(): void {
        this.getProjects();
    }
    
    getProjects(): void {
        this.api.project.getProjects().promise().then(resp => {
            this.projects = resp;
            if (this.projects.length) {
                this.selectedProject = this.projects[0];
                this.select.emit(this.selectedProject);
            }
            setTimeout(() => {
                this.accordion.openAll();
            }, 500);
        });
    }
    
    selectProject(project): void {
        this.selectedProject = project;
        this.select.emit(this.selectedProject);
    }
    
    clickExpand(): void {
        if (this.expanded) {
            this.accordion.closeAll();
        } else {
            this.accordion.openAll();
        }
        this.expanded = !this.expanded;
    }
   
}
