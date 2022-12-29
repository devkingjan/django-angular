import { CalendarEventAction } from 'angular-calendar';
import { startOfDay, endOfDay } from 'date-fns';

export class CalendarEventModel
{
    id: number;
    start: Date;
    end?: Date;
    title: string;
    color: {
        primary: string;
        secondary: string;
    };
    actions?: CalendarEventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
    members?: number[];
    // tslint:disable-next-line:variable-name
    member_list?: any[];
    // tslint:disable-next-line:variable-name
    is_owner?: boolean;
    meta?: {
        location: string,
        notes: string
    };

    /**
     * Constructor
     *
     * @param data
     */
    constructor(data?)
    {
        data = data || {};
        this.id = data.id;
        this.start = new Date(data.start) || startOfDay(new Date());
        this.end = new Date(data.end) || endOfDay(new Date());
        this.title = data.title || '';
        this.color = {
            primary  : data.color && data.color.primary || '#1e90ff',
            secondary: data.color && data.color.secondary || '#D1E8FF'
        };
        this.draggable = data.draggable;
        this.resizable = {
            beforeStart: data.resizable && data.resizable.beforeStart || false,
            afterEnd   : data.resizable && data.resizable.afterEnd || false
        };
        this.actions = data.actions || [];
        this.allDay = data.allDay || false;
        this.cssClass = data.cssClass || '';
        this.members = data.members || [];
        this.member_list = data.member_list || [];
        this.is_owner = data.is_owner;
        this.meta = {
            location: data.meta && data.meta.location || '',
            notes   : data.meta && data.meta.notes || ''
        };
    }
}
