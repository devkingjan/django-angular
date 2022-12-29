import {Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CalendarEvent} from 'angular-calendar';

import {MatColors} from '@fuse/mat-colors';
import {CalendarEventModel} from '../../../../models/calcendar-event';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {map, startWith} from 'rxjs/operators';
import {ApiService} from '../../../../../@fuse/api/api.service';
import {Member} from "../../../../models/member";
import {MemberNewComponent} from "../../members/member-new/member-new.component";


@Component({
    selector: 'calendar-event-form-dialog',
    templateUrl: './event-form.component.html',
    styleUrls: ['./event-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CalendarEventFormDialogComponent implements OnInit {
    // member list
    visible = true;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    memberCtrl = new FormControl();
    members = [];
    selectedMembers: Member[] = [];
    @ViewChild('memberInput') memberInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;
    
    
    action: string;
    event: CalendarEventModel;
    eventForm: FormGroup;
    dialogTitle: string;
    presetColors = MatColors.presets;
    startTime: any = null;
    endTime: any = null;
    
    colors = [
        {
            primary: '#0b2b3a',
            secondary: '#0b2b3a'
        },
        {
            primary: '#f07261',
            secondary: '#f07261'
        },
        {
            primary: '#75a6c9',
            secondary: '#75a6c9'
        },

    ];
    
    /**
     * Constructor
     *
     * @param {MatDialogRef<CalendarEventFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<CalendarEventFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private api: ApiService,
        private dialog: MatDialog,
    ) {
        this.event = _data.event;
        this.action = _data.action;
        
        if (this.action === 'edit') {
            this.dialogTitle = this.event.title;
            let hours, minutes;
            hours = new Date(this.event.start).getHours();
            hours = ('0' + hours).slice(-2);
            minutes = new Date(this.event.start).getMinutes();
            minutes = ('0' + minutes).slice(-2);
            this.startTime = `${hours}:${minutes}`;
            hours = new Date(this.event.end).getHours();
            hours = ('0' + hours).slice(-2);
            minutes = new Date(this.event.end).getMinutes();
            minutes = ('0' + minutes).slice(-2);
            this.endTime = `${hours}:${minutes}`;
        } else {
            this.dialogTitle = 'New Event';
            this.event = new CalendarEventModel({
                start: _data.date,
                end: _data.date,
                is_owner: true,
                draggable: false,
            });
        }
        
        this.eventForm = this.createEventForm();
    }
    
    ngOnInit(): void {
        this.getMembers();
    }
    
    getMembers(): void {
        this.api.member.get().promise().then(resp => {
            resp.forEach(m => {
                if (this.event.members.indexOf(m.id) !== -1) {
                    this.selectedMembers.push(m);
                } else {
                    this.members.push(m);
                }
            });
        });
    }
    
    remove(member: Member): void {
        const index = this.selectedMembers.indexOf(member);
        this.members.push(member);
        if (index >= 0) {
            this.selectedMembers.splice(index, 1);
        }
    }
    
    selected(event: MatAutocompleteSelectedEvent): void {
        this.selectedMembers.push(event.option.value);
        this.members = this.members.filter(m => m.id !== event.option.value.id);
        this.memberInput.nativeElement.value = '';
        this.memberInput.nativeElement.blur();
        this.memberCtrl.setValue(null);
    }
    
    createMember(): void {
        console.log('');
    }
    
    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    
    /**
     * Create the event form
     *
     * @returns {FormGroup}
     */
    createEventForm(): FormGroup {
        return new FormGroup({
            title: new FormControl({value: this.event.title, disabled: !this.event.is_owner}),
            start: new FormControl({value: this.event.start, disabled: !this.event.is_owner}),
            end: new FormControl({value: this.event.end, disabled: !this.event.is_owner}),
            allDay: new FormControl({value: this.event.allDay, disabled: !this.event.is_owner}),
            meta:
                this._formBuilder.group({
                    location: new FormControl({value: this.event.meta.location, disabled: !this.event.is_owner}),
                    notes: new FormControl({value: this.event.meta.notes, disabled: !this.event.is_owner})
                })
        });
    }
    
    addEvent(): void {
        if (!this.startTime) {
            this.startTime = '00:00';
        }
        if (!this.endTime) {
            this.endTime = '00:00';
        }
        const newEvent = this.eventForm.getRawValue();
        // tslint:disable-next-line:one-variable-per-declaration
        let year, month, date, hour, min;
        year = new Date(this.eventForm.value.start).getFullYear();
        month = new Date(this.eventForm.value.start).getMonth();
        date = new Date(this.eventForm.value.start).getDate();
        hour = this.startTime.split(':')[0];
        min = this.startTime.split(':')[1];
        newEvent.start = new Date(year, month, date, hour, min);
        year = new Date(this.eventForm.value.end).getFullYear();
        month = new Date(this.eventForm.value.end).getMonth();
        date = new Date(this.eventForm.value.end).getDate();
        hour = this.endTime.split(':')[0];
        min = this.endTime.split(':')[1];
        newEvent.end = new Date(year, month, date, hour, min);
        const randomIndex = Math.floor((Math.random() * 3));
        newEvent.color = this.colors[randomIndex];
        newEvent.members = this.selectedMembers.map(m => m.id);
        this.matDialogRef.close(newEvent);
    }
    
    saveEvent(): void {
        const members = this.selectedMembers.map(m => m.id);
        if (!this.startTime) {
            this.startTime = '00:00';
        }
        if (!this.endTime) {
            this.endTime = '00:00';
        }
        const newEvent = this.eventForm.getRawValue();
        // tslint:disable-next-line:one-variable-per-declaration
        let year, month, date, hour, min;
        year = new Date(this.eventForm.value.start).getFullYear();
        month = new Date(this.eventForm.value.start).getMonth();
        date = new Date(this.eventForm.value.start).getDate();
        hour = this.startTime.split(':')[0];
        min = this.startTime.split(':')[1];
        newEvent.start = new Date(year, month, date, hour, min);
        year = new Date(this.eventForm.value.end).getFullYear();
        month = new Date(this.eventForm.value.end).getMonth();
        date = new Date(this.eventForm.value.end).getDate();
        hour = this.endTime.split(':')[0];
        min = this.endTime.split(':')[1];
        const randomIndex = Math.floor((Math.random() * 3));
        newEvent.color = this.colors[randomIndex];
        newEvent.end = new Date(year, month, date, hour, min);
        newEvent.members = this.selectedMembers.map(m => m.id);
        this.matDialogRef.close(['save', newEvent]);
    }
}
