import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile/profile.component';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDialogModule} from '@angular/material/dialog';
import {FuseSharedModule} from '@fuse/shared.module';
import {ColorPickerModule} from 'ngx-color-picker';
import {ChangePasswordComponent} from './profile/change-password/change-password.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {UploadImageComponent} from './profile/upload-image/upload-image.component';
import {ImageCropperModule} from 'ngx-image-cropper';
import {MembersComponent} from './members/members.component';
import {ContentModule} from '../../layout/components/content/content.module';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MemberCardComponent} from './members/member-card/member-card.component';
import {MemberNewComponent} from './members/member-new/member-new.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatBadgeModule} from '@angular/material/badge';
import {MemberInviteComponent} from './members/member-invite/member-invite.component';
import {MemberStatisticComponent} from './members/member-statistic/member-statistic.component';
import {MemberPermissionComponent} from './members/member-permission/member-permission.component';
import {ChartsModule} from 'ng2-charts';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {MatDividerModule} from '@angular/material/divider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {ExperimentsComponent} from './experiments/experiments.component';
import {TextComponent} from '../components/widget/text/text.component';
import {DateComponent} from '../components/widget/date/date.component';
import {NumberComponent} from '../components/widget/number/number.component';
import {DropdownComponent} from '../components/widget/dropdown/dropdown.component';
import {HeaderItemComponent} from '../components/widget/header-item/header-item.component';
import {NewDatabaseComponent} from './experiments/new-database/new-database.component';
import {NewExperimentComponent} from './experiments/new-experiment/new-experiment.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {DisplayWidgetComponent} from '../components/widget/display-widget/display-widget.component';
import {MatListModule} from '@angular/material/list';
import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {ExperimentFilterComponent} from './experiments/experiment-filter/experiment-filter.component';
import {CloseExperimentComponent} from './experiments/close-experiment/close-experiment.component';
import {MatPaginatorModule} from '@angular/material/paginator';
import {ConfirmDeletionComponent} from './experiments/new-database/confirm-deletion/confirm-deletion.component';
import {InventoriesComponent} from './inventories/inventories.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {StorageLocationPanelComponent} from './inventories/panel/storage-location-panel/storage-location-panel.component';
import {InventoryDatabasesPanelComponent} from './inventories/panel/inventory-databases-panel/inventory-databases-panel.component';
import {AddNewSamplePanelComponent} from './inventories/panel/add-new-sample-panel/add-new-sample-panel.component';
import {NewInventoryDatabaseComponent} from './inventories/panel/inventory-databases-panel/new-inventory-database/new-inventory-database.component';
import {SamplesComponent} from './inventories/samples/samples.component';
import {NewSampleComponent} from './inventories/samples/new-sample/new-sample.component';
import {NewStorageLocationComponent} from './inventories/panel/storage-location-panel/new-storage-location/new-storage-location.component';
import {CreateItemWithNameComponent} from '../components/create-item-with-name/create-item-with-name.component';
import {ViewStorageLocationComponent} from './inventories/panel/storage-location-panel/view-storage-location/view-storage-location.component';
import {BoxMapviewComponent} from './inventories/box-mapview/box-mapview.component';
import {NewEquipmentComponent} from './inventories/panel/storage-location-panel/new-equipment/new-equipment.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatStepperModule} from '@angular/material/stepper';
import {ColumnDecisionComponent} from '../components/column-decision/column-decision.component';
import {SampleInfoComponent} from '../components/new-sample/sample-info/sample-info.component';
import {SampleLocationComponent} from '../components/new-sample/sample-location/sample-location.component';
import {MultiVialsComponent} from '../components/new-sample/multi-vials/multi-vials.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {DoubleConfirmComponent} from '../components/double-confirm/double-confirm.component';
import {SelectLocationDropmenuComponent} from '../components/select-location-dropmenu/select-location-dropmenu.component';
import {ManageOptionsComponent} from '../components/manage-options/manage-options.component';
import {RemoveOptionComponent} from '../components/remove-option/remove-option.component';
import {PagesRoutingModule} from './pages-routing.module';
import {FuseThemeOptionsModule} from '@fuse/components';
import {RemoveWithConfirmComponent} from '../components/remove-with-confirm/remove-with-confirm.component';
import {MissionControlComponent} from './mission-control/mission-control.component';
import {MissionCalendarComponent} from '../components/mission-calendar/mission-calendar.component';
import {CalendarModule} from './calendar/calendar.module';
import {TaskManagerComponent} from './task-manager/task-manager.component';
import {DailyTaskComponent} from '../components/daily-task/daily-task.component';
import {TaskListComponent} from '../components/task-list/task-list.component';
import {DisplayDayComponent} from '../components/display-day/display-day.component';
import {TaskItemComponent} from '../components/task-item/task-item.component';
import {SelectDateComponent} from '../components/select-date/select-date.component';
import {NewTaskListComponent} from '../components/new-task-list/new-task-list.component';
import {NewTaskComponent} from '../components/new-task/new-task.component';
import {ConfirmRequestComponent} from '../components/confirm-request/confirm-request.component';
import {MissionTaskComponent} from '../components/mission-task/mission-task.component';
import {CalculatorComponent} from './calculator/calculator.component';
import {MatTabsModule} from '@angular/material/tabs';
import {CalculatorDilutionComponent} from '../components/calculator-dilution/calculator-dilution.component';
import {CalculatorMassComponent} from '../components/calculator-mass/calculator-mass.component';
import {CalculatorVolumeComponent} from '../components/calculator-volume/calculator-volume.component';
import {CalculatorMolarityComponent} from '../components/calculator-molarity/calculator-molarity.component';
import {TeamMemberCardComponent} from './members/team-member-card/team-member-card.component';
import {MissionCellCultureComponent} from '../components/mission-cell-culture/mission-cell-culture.component';
import {CellCultureHistoryComponent} from './cell-culture-history/cell-culture-history.component';
import {WriteNotebookComponent} from './lab-notebook/write-notebook/write-notebook.component';
import {EcoFabSpeedDialModule} from '@ecodev/fab-speed-dial';
import {LabWriteESignComponent} from '../components/lab-write-e-sign/lab-write-e-sign.component';
import {AssignTeamComponent} from '../components/assign-team/assign-team.component';
import {LabWriteChooseImgComponent} from '../components/lab-write-choose-img/lab-write-choose-img.component';
import {LabWriteSectionImageComponent} from '../components/lab-write-section-image/lab-write-section-image.component';
import {LabWriteSectionTextComponent} from '../components/lab-write-section-text/lab-write-section-text.component';
import {LabWriteSectionTableComponent} from '../components/lab-write-section-table/lab-write-section-table.component';
import {CdkTableModule} from '@angular/cdk/table';
import {ViewNotebookComponent} from './lab-notebook/view-notebook/view-notebook.component';
import {QuillModule} from 'ngx-quill';
import {LabDocComponent} from '../components/lab-doc/lab-doc.component';
import {LabTableContentComponent} from '../components/lab-table-content/lab-table-content.component';
import {NewCellCultureLineComponent} from '../components/new-cell-culture-line/new-cell-culture-line.component';
import {ManageCultureMediumComponent} from '../components/manage-culture-medium/manage-culture-medium.component';
import {MatRadioModule} from '@angular/material/radio';
import {CellCultureEventPanelComponent} from '../components/cell-culture-event-panel/cell-culture-event-panel.component';
import {NewCellCultureEventComponent} from '../components/new-cell-culture-event/new-cell-culture-event.component';
import {CellCultureHistoryNavigatePanelComponent} from '../components/cell-culture-history-navigate-panel/cell-culture-history-navigate-panel.component';
import {CellCultureHistoryViewComponent} from '../components/cell-culture-history-view/cell-culture-history-view.component';
import {CellCultureHistoryItemComponent} from '../components/cell-culture-history-view/cell-culture-history-item/cell-culture-history-item.component';
import {RemoveCellCultureLineComponent} from '../components/remove-cell-culture-line/remove-cell-culture-line.component';
import {MissionInventoryComponent} from '../components/mission-inventory/mission-inventory.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MissionExperimentComponent} from '../components/mission-experiment/mission-experiment.component';
import {MissionDocumentComponent} from '../components/mission-document/mission-document.component';
import {MissionExperimentReviewComponent} from '../components/mission-experiment-review/mission-experiment-review.component';
import {MissionScannedDocumentsComponent} from '../components/mission-scanned-documents/mission-scanned-documents.component';
import { ProjectManagerComponent } from './project-manager/project-manager.component';
import { ProjectHistoryComponent } from './project-history/project-history.component';
import { ProjectTimelineComponent } from './project-timeline/project-timeline.component';
import { NewProjectComponent } from './project-manager/new-project/new-project.component';
import { ProjectComponent } from './project-manager/project/project.component';
import { ProjectTaskComponent } from './project-manager/project/project-task/project-task.component';
import {PendingChangesGuard} from './pending-changes.guard';
import { ProjectNewTaskComponent } from './project-manager/project/project-new-task/project-new-task.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {LabFileViewerComponent} from '../components/lab-file-viewer/lab-file-viewer.component';
import { LabWriteSectionFileComponent } from '../components/lab-write-section-file/lab-write-section-file.component';
import { TaskCommentComponent } from './project-manager/task-comment/task-comment.component';
import { ProjectHistorySelectionComponent } from './project-history/project-history-selection/project-history-selection.component';
import { ProjectHistoryViewComponent } from './project-history/project-history-view/project-history-view.component';
import { ProjectHistoryViewItemComponent } from './project-history/project-history-view-item/project-history-view-item.component';
import { TaskChartComponent } from './project-timeline/task-chart/task-chart.component';
import { ProjectSelectorComponent } from './project-timeline/project-selector/project-selector.component';
import { ChangePinComponent } from './profile/change-pin/change-pin.component';
import { ForgotPinComponent} from './forgot-pin/forgot-pin.component';
import { ResetPinComponent } from './reset-pin/reset-pin.component';
import {InfiniteScrollModule} from 'ngx-infinite-scroll';


@NgModule({
    declarations: [
        ProfileComponent,
        ChangePasswordComponent,
        UploadImageComponent,
        MembersComponent,
        MemberCardComponent,
        MemberNewComponent,
        MemberInviteComponent,
        MemberStatisticComponent,
        MemberPermissionComponent,
        ExperimentsComponent,
        HeaderItemComponent,
        TextComponent,
        DateComponent,
        NumberComponent,
        DropdownComponent,
        NewDatabaseComponent,
        NewExperimentComponent,
        DisplayWidgetComponent,
        ExperimentFilterComponent,
        CloseExperimentComponent,
        ConfirmDeletionComponent,
        InventoriesComponent,
        StorageLocationPanelComponent,
        InventoryDatabasesPanelComponent,
        AddNewSamplePanelComponent,
        NewInventoryDatabaseComponent,
        SamplesComponent,
        NewSampleComponent,
        NewStorageLocationComponent,
        CreateItemWithNameComponent,
        ViewStorageLocationComponent,
        BoxMapviewComponent,
        NewEquipmentComponent,
        ColumnDecisionComponent,
        SampleInfoComponent,
        SampleLocationComponent,
        MultiVialsComponent,
        DoubleConfirmComponent,
        SelectLocationDropmenuComponent,
        RemoveOptionComponent,
        ManageOptionsComponent,
        RemoveWithConfirmComponent,
        MissionControlComponent,
        MissionCalendarComponent,
        TaskManagerComponent,
        DailyTaskComponent,
        TaskListComponent,
        DisplayDayComponent,
        TaskItemComponent,
        SelectDateComponent,
        NewTaskListComponent,
        NewTaskComponent,
        ConfirmRequestComponent,
        MissionTaskComponent,
        CalculatorComponent,
        CalculatorDilutionComponent,
        CalculatorMassComponent,
        CalculatorVolumeComponent,
        CalculatorMolarityComponent,
        TeamMemberCardComponent,
        MissionCellCultureComponent,
        CellCultureHistoryComponent,
        NewCellCultureLineComponent,
        ManageCultureMediumComponent,
        CellCultureEventPanelComponent,
        NewCellCultureEventComponent,
        CellCultureHistoryNavigatePanelComponent,
        CellCultureHistoryViewComponent,
        CellCultureHistoryItemComponent,
        RemoveCellCultureLineComponent,
        MissionInventoryComponent,
        WriteNotebookComponent,
        LabWriteESignComponent,
        AssignTeamComponent,
        LabWriteChooseImgComponent,
        LabWriteSectionImageComponent,
        LabWriteSectionTextComponent,
        LabWriteSectionTableComponent,
        ViewNotebookComponent,
        LabDocComponent,
        LabTableContentComponent,
        MissionExperimentComponent,
        MissionDocumentComponent,
        MissionExperimentReviewComponent,
        MissionScannedDocumentsComponent,
        ProjectManagerComponent,
        ProjectHistoryComponent,
        ProjectTimelineComponent,
        NewProjectComponent,
        ProjectComponent,
        ProjectTaskComponent,
        ProjectNewTaskComponent,
        LabFileViewerComponent,
        LabWriteSectionFileComponent,
        TaskCommentComponent,
        ProjectHistorySelectionComponent,
        ProjectHistoryViewComponent,
        ProjectHistoryViewItemComponent,
        TaskChartComponent,
        ProjectSelectorComponent,
        ChangePinComponent,
        ForgotPinComponent,
        ResetPinComponent
    ],
    imports: [
        PagesRoutingModule,
        ImageCropperModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatDialogModule,
        MatSnackBarModule,
        MatChipsModule,
        MatMenuModule,
        MatToolbarModule,
        MatBadgeModule,
        MatDividerModule,
        MatTableModule,
        MatDatepickerModule,
        MatSlideToggleModule,
        MatListModule,
        MatPaginatorModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        MatTabsModule,
        MatButtonToggleModule,
        DragDropModule,
        ChartsModule,
        NgxChartsModule,
        FuseSharedModule,
        CommonModule,
        MatExpansionModule,
        ColorPickerModule,
        ContentModule,
        FuseThemeOptionsModule,
        CalendarModule,
        MatRadioModule,
        EcoFabSpeedDialModule,
        CdkTableModule,
        InfiniteScrollModule,
        QuillModule.forRoot(),
        MatAutocompleteModule
    ],
    providers: [PendingChangesGuard],
})
export class PagesModule {
}
