import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {MembersComponent} from './members/members.component';
import {ProfileComponent} from './profile/profile.component';
import {ExperimentsComponent} from './experiments/experiments.component';
import {InventoriesComponent} from './inventories/inventories.component';
import {SamplesComponent} from './inventories/samples/samples.component';
import {BoxMapviewComponent} from './inventories/box-mapview/box-mapview.component';
import {MissionControlComponent} from './mission-control/mission-control.component';
import {TaskManagerComponent} from './task-manager/task-manager.component';
import {CalculatorComponent} from './calculator/calculator.component';
import {CellCultureHistoryComponent} from './cell-culture-history/cell-culture-history.component';
import {WriteNotebookComponent} from './lab-notebook/write-notebook/write-notebook.component';
import {ViewNotebookComponent} from './lab-notebook/view-notebook/view-notebook.component';
import {ProjectManagerComponent} from "./project-manager/project-manager.component";
import {PendingChangesGuard} from "./pending-changes.guard";
import {ProjectHistoryComponent} from "./project-history/project-history.component";
import {ProjectTimelineComponent} from "./project-timeline/project-timeline.component";
import {ForgotPinComponent} from './forgot-pin/forgot-pin.component';
import {ResetPinComponent} from './reset-pin/reset-pin.component';

const routes: Routes = [
    {
        path        : 'dashboard',
        component: MembersComponent,
    },
    {
        path        : 'profile',
        component: ProfileComponent
    },
    {
        path        : 'experiments',
        component: ExperimentsComponent
    },
    {
        path        : 'inventories',
        component: InventoriesComponent
    },
    {
        path        : 'inventories/:id/samples/:mode',
        component: SamplesComponent
    },
    {
        path        : 'inventories/location/:id/map-view',
        component: BoxMapviewComponent
    },
    {
        path        : 'calendar',
        loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule)
    },
    {
        path        : 'mission-control',
        component: MissionControlComponent
    },
    {
        path        : 'task-manager',
        component: TaskManagerComponent
    },
    {
        path        : 'molarity-calculator',
        component: CalculatorComponent
    },
    {
        path        : 'file-manager',
        loadChildren: () => import('./file-manager/file-manager.module').then(m => m.FileManagerModule)
    },
    {
        path        : 'member/:id/storage',
        loadChildren: () => import('./file-manager/file-manager.module').then(m => m.FileManagerModule)
    },
    {
        path        : 'cell-culture-history',
        component: CellCultureHistoryComponent
    },
    {
        path        : 'lab/view-notebook',
        component: ViewNotebookComponent
    },
    {
        path        : 'lab/write-notebook',
        component: WriteNotebookComponent,
        canDeactivate: [PendingChangesGuard]
    },
    {
        path        : 'project-manager',
        component: ProjectManagerComponent
    },
    {
        path        : 'project-history',
        component: ProjectHistoryComponent
    },
    {
        path        : 'project-timeframe',
        component: ProjectTimelineComponent
    },
    {
        path        : 'forgot-pin',
        component: ForgotPinComponent
    },
    {
        path        : 'reset-pin/:uid/:token',
        component: ResetPinComponent
    },
    {
        path        : '**',
        redirectTo: 'dashboard'
    }
];

@NgModule({
    declarations: [],
    imports: [
        RouterModule.forChild(routes),
        CommonModule
    ],
    exports: [RouterModule]
    
})
export class PagesRoutingModule { }
