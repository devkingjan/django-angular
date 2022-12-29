import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {Router} from '@angular/router';
import {ApiService} from "../../../../../@fuse/api/api.service";
import {Project} from "../../../../models/project";

@Component({
  selector: 'app-project-selector',
  templateUrl: './project-selector.component.html',
  styleUrls: ['./project-selector.component.scss']
})
export class ProjectSelectorComponent implements OnInit, OnChanges {
    @Input() projects: Project[];
    @Output() select = new EventEmitter();
    expanded = true;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    checkedProjects: Project[] = [];
    project: Project = null;
    constructor(
        private api: ApiService,
        private router: Router,
    ) {

    }
    ngOnInit(): void {
    }
    
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.projects) {
            this.checkedProjects = changes.projects.currentValue;
            this.select.emit(this.checkedProjects);
        }
    }
    
    
    selectALlProject(project: Project): void {
        this.project = project;
    }
    
    checkedProject(check, project): void {
        if (check) {
            this.checkedProjects.push(project);
        } else {
            this.checkedProjects = this.checkedProjects.filter(p => p.id !== project.id);
        }
        this.select.emit(this.checkedProjects);
    }
    
    clickExpand(): void {
        this.expanded = !this.expanded;
        if (this.expanded) {
            this.accordion.closeAll();
        } else {
            this.accordion.openAll();
        }
    }

}
