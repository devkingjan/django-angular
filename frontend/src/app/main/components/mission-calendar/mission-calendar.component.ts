import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';
import {ApiService} from '../../../../@fuse/api/api.service';
import {MatDialog} from '@angular/material/dialog';
import {CalendarEventModel} from '../../../models/calcendar-event';
import {CalendarEvent, CalendarEventAction} from 'angular-calendar';
import {RemoveWithConfirmComponent} from '../remove-with-confirm/remove-with-confirm.component';
import {CalendarEventFormDialogComponent} from '../../pages/calendar/event-form/event-form.component';
import {CalendarService} from '../../pages/calendar/calendar.service';
import {startOfDay} from 'date-fns';
import {fuseAnimations} from '../../../../@fuse/animations';

@Component({
    selector: 'app-mission-calendar',
    templateUrl: './mission-calendar.component.html',
    styleUrls: ['./mission-calendar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MissionCalendarComponent implements OnInit {
    panelOpenState = false;
    actions: CalendarEventAction[];
    expanded = true;
    dialogRef: any;
    selectedDay: any;
    events: CalendarEventModel[] = [];
    columns: any = [];
    getResponse = false;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    
    constructor(
        private api: ApiService,
        private dialog: MatDialog,
        private _matDialog: MatDialog,
        private _calendarService: CalendarService,
    ) {
        this.selectedDay = {date: startOfDay(new Date())};
        this.actions = [];
    }
    
    ngOnInit(): void {
        this.getCalendars();
    }
    
    getCalendars(): void {
        this.getResponse = false;
        const today = this.getStatTime(new Date());
        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        tomorrow = this.getStatTime(tomorrow);
        this.api.calendar.get().promise().then(resp => {
            this.events = resp.filter(e => {
                return (new Date(e.start) >= today && new Date(e.start) < tomorrow) || (new Date(e.start) < today && new Date(e.end) >= today);
            });
            this.getResponse = true;
            setTimeout(() => {
                this.accordion.openAll();
            }, 500);
        });
    }
    
    getStatTime(d): any {
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d;
    }
    
    /**
     * Delete Event
     *
     * @param event
     */
    deleteEvent(event): void {
        const dialogRef = this._matDialog.open(RemoveWithConfirmComponent,
            {
                data: {
                    name: event.title,
                    description: `You are about to delete event ${event.title}.This cannot be undone. Do you wish to proceed?`
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.confirm) {
                this.api.calendar.delete(event.id).promise().then(resp => {
                    const eventIndex = this.events.indexOf(event);
                    this.events.splice(eventIndex, 1);
                });
            }
        });
    }
    
    /**
     * Edit Event
     *
     * @param {string} action
     * @param {CalendarEvent} event
     */
    editEvent(action: string, event: CalendarEventModel): void {
        const eventIndex = this.events.indexOf(event);
        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data: {
                event: event,
                action: action
            }
        });
        
        this.dialogRef.afterClosed()
            .subscribe(response => {
                if (!response) {
                    return;
                }
                const actionType: string = response[0];
                const formData: any = response[1];
                switch (actionType) {
                    /**
                     * Save
                     */
                    case 'save':
                        this.updateEvent(eventIndex, formData);
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        this.deleteEvent(event);
                        break;
                }
            });
    }
    
    /**
     * Add Event
     */
    addEvent(): void {
        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data: {
                action: 'new',
                date: this.selectedDay.date
            }
        });
        this.dialogRef.afterClosed()
            .subscribe((response: any) => {
                if (!response) {
                    return;
                }
                this.createEvent(response);
            });
    }
    
    createSampleForDatabase(database): void {
        this.api.inventory.getColumns(database.id).promise().then(resp => {
            // this.dialog.open(NewSampleComponent, {data: {columns: resp, databaseId: database.id, data: null}});
        });
    }
    
    createEvent(response): void {
        this.api.calendar.create(response).promise().then(resp => {
            resp.actions = this.actions;
            this.events.push(resp);
        });
    }
    
    updateEvent(eventIndex, obj): void {
        this.api.calendar.update(this.events[eventIndex].id, obj).promise().then(resp => {
            this.events[eventIndex] = Object.assign(this.events[eventIndex], resp);
        });
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
