
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { startOfDay, isSameDay, isSameMonth } from 'date-fns';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay } from 'angular-calendar';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { fuseAnimations } from '@fuse/animations';
import {CalendarService} from './calendar.service';
import {CalendarEventModel} from '../../../models/calcendar-event';
import {CalendarEventFormDialogComponent} from './event-form/event-form.component';
import {ApiService} from '../../../../@fuse/api/api.service';
import {DoubleConfirmComponent} from "../../components/double-confirm/double-confirm.component";
import {RemoveWithConfirmComponent} from "../../components/remove-with-confirm/remove-with-confirm.component";

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class CalendarComponent implements OnInit {
    actions: CalendarEventAction[];
    activeDayIsOpen: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    dialogRef: any;
    events: CalendarEvent[];
    refresh: Subject<any> = new Subject();
    selectedDay: any;
    view: string;
    viewDate: Date;
    clickTime: any;

    constructor(
        private _matDialog: MatDialog,
        private _calendarService: CalendarService,
        private api: ApiService
    )
    {
        // Set the defaults
        this.view = 'month';
        this.viewDate = new Date();
        this.activeDayIsOpen = true;
        this.selectedDay = {date: startOfDay(new Date())};

        this.actions = [
            {
                label  : '<i class="material-icons s-16">edit</i>',
                onClick: ({event}: { event: CalendarEvent }): void => {
                    this.editEvent('edit', event);
                }
            },
            {
                label  : '<i class="material-icons s-16">close</i>',
                onClick: ({event}: { event: CalendarEvent }): void => {
                    this.deleteEvent(event);
                }
            }
        ];

        /**
         * Get events from service/server
         */
        this.setEvents();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        /**
         * Watch re-render-refresh for updating db
         */
        this.refresh.subscribe(updateDB => {
            if ( updateDB )
            {
                this._calendarService.updateEvents(this.events);
            }
        });

        this._calendarService.onEventsUpdated.subscribe(events => {
            this.setEvents();
            this.refresh.next();
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Set events
     */
    setEvents(): void
    {
        this.api.calendar.get().promise().then(resp => {
            this.events = resp.map(item => {
                    item.actions = this.actions;
                    return new CalendarEventModel(item);
                }
            );
        });
    }

    /**
     * Before View Renderer
     *
     * @param {any} header
     * @param {any} body
     */
    beforeMonthViewRender({header, body}): void
    {
        /**
         * Get the selected day
         */
        const _selectedDay = body.find((_day) => {
            return _day.date.getTime() === this.selectedDay.date.getTime();
        });

        if ( _selectedDay )
        {
            /**
             * Set selected day style
             * @type {string}
             */
            _selectedDay.cssClass = 'cal-selected';
        }
    }

    /**
     * Day clicked
     *
     * @param {MonthViewDay} day
     */
    dayClicked(day: CalendarMonthViewDay): void
    {
        
        const date: Date = day.date;
        const events: CalendarEvent[] = day.events;
        this.selectedDay = day;
        const currentTime = new Date().getTime();
        if (this.clickTime && currentTime - this.clickTime < 300) {
            this.addEvent();
            this.clickTime = null;
            return;
        } else {
            this.clickTime = currentTime;
        }
        
        if ( isSameMonth(date, this.viewDate) )
        {
            if ( (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0 )
            {
                this.activeDayIsOpen = false;
            }
            else
            {
                this.activeDayIsOpen = true;
                this.viewDate = date;
            }
        }
        this.refresh.next();
        
    }

    /**
     * Event times changed
     * Event dropped or resized
     *
     * @param {CalendarEvent} event
     * @param {Date} newStart
     * @param {Date} newEnd
     */
    eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void
    {
        event.start = newStart;
        event.end = newEnd;
        this.refresh.next(true);
    }

    /**
     * Delete Event
     *
     * @param event
     */
    deleteEvent(event): void
    {
        const dialogRef = this._matDialog.open(RemoveWithConfirmComponent,
            {data: {name: event.title, description: ``, title: `Are you sure you want to delete event: "${event.title}"?`}});
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.confirm) {
                this.api.calendar.delete(event.id).promise().then(resp => {
                    const eventIndex = this.events.indexOf(event);
                    this.events.splice(eventIndex, 1);
                    this.refresh.next(true);
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
    editEvent(action: string, event: CalendarEvent): void
    {
        const eventIndex = this.events.indexOf(event);
        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data      : {
                event : event,
                action: action
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: any = response[1];
                switch ( actionType )
                {
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
    addEvent(): void
    {
        this.dialogRef = this._matDialog.open(CalendarEventFormDialogComponent, {
            panelClass: 'event-form-dialog',
            data      : {
                action: 'new',
                date  : this.selectedDay.date
            }
        });
        this.dialogRef.afterClosed()
            .subscribe((response: any) => {
                if ( !response )
                {
                    return;
                }
                this.createEvent(response);
            });
    }
    createEvent(response): void {
        this.api.calendar.create(response).promise().then(resp => {
            resp.actions = this.actions;
            this.events.push(resp);
            this.refresh.next(true);
        });
    }
    updateEvent(eventIndex, obj): void {
        this.api.calendar.update(this.events[eventIndex].id, obj).promise().then(resp => {
            this.events[eventIndex] = Object.assign(this.events[eventIndex], resp);
            this.refresh.next(true);
        });
    }
}



