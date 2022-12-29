import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Project} from "../../../../models/project";
import {ProjectTask} from "../../../../models/project-task";
import {UtilsService} from "../../../../../@fuse/services/utils.service";
import {FuseConfigService} from "../../../../../@fuse/services/config.service";

declare var Plotly: any;

@Component({
    selector: 'app-task-chart',
    templateUrl: './task-chart.component.html',
    styleUrls: ['./task-chart.component.scss']
})
export class TaskChartComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() project: Project;
    @ViewChild('chart') el: ElementRef;
    dataList: any[] = [];
    taskNames: string[] = [];
    tickVals: number[] = [];
    isDark = false;
    isBlind = false;
    color = {
        done: '#70ad47',
        in_progress: '#ffc000',
        in_planing: '#b3b3b3',
        on_hold: '#c00000'
    };
    
    constructor(
        private util: UtilsService,
        private _fuseConfigService: FuseConfigService,
    ) {
    }
    
    ngOnInit(): void {
        this._fuseConfigService.config.subscribe((config) => {
            this.isDark = config.colorTheme === 'theme-blue-gray-dark';
            this.isBlind = config.colorTheme === 'theme-yellow-light';
            if (this.el) {
                Plotly.purge(this.el.nativeElement);
                this.basicChart();
            }
        });
    }
    
    ngOnChanges(changes: SimpleChanges): void {
        const project = changes.project.currentValue;
        this.dataList = [];
        this.taskNames = [];
        this.tickVals = [];
        const tasks: ProjectTask[] = project.tasks;
        for (let i = 0; i < tasks.length; i++) {
            const data = {
                x: [this.util.getStatTime(new Date(tasks[i].start_time)), this.util.getStatTime(new Date(tasks[i].end_time))],
                y: [0 - i, 0 - i],
                name: tasks[i].title,
                line: {
                    color: this.color[tasks[i].status],
                    width: 20,
                },
            };
            this.dataList.push(data);
            this.taskNames.push(tasks[i].title);
            this.tickVals.push(0 - i);
        }
    }
    
    ngAfterViewInit(): void {
        this.basicChart();
    }
    
    basicChart(): void {
        const element = this.el.nativeElement;
        const layout = {
            xaxis: {
                type: 'date',
                ticks: 'outside',
                tickwidth: 6,
                tickcolor: '#000',
                tickfont: {
                    size: 12,
                    color: this.isDark ? 'white' : 'black',
                },
            },
            height: 50 * this.taskNames.length + 80,
            margin: {
                t: 30,
                b: 50,
                l: 400,
                r: 50
            },
            yaxis: {
                tickmode: 'array',
                tickvals: this.tickVals,
                ticktext: this.taskNames,
                ticks: '',
                tickwidth: 0,
                tickfont: {
                    size: 12,
                    color: this.isDark ? 'white' : 'black',
                },
                tickcolor: null,
                ticklen: 0,
                linecolor: 'black',
                mirror: true
            },
            showlegend: false,
            plot_bgcolor: this.isDark ? '#212121' : 'white',
            paper_bgcolor: this.isDark ? '#212121' : 'white'
        };
        const defaultPlotlyConfiguration = { modeBarButtonsToRemove: ['sendDataToCloud', 'autoScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian', 'lasso2d', 'select2d', 'toImage'], displaylogo: false, showTips: true };
        Plotly.plot(element, this.dataList, layout, defaultPlotlyConfiguration);
    }
    
}
