import {CellCultureEvent} from './cell-culture-event';
import {CellCultureLine} from './cell-culture-line';

export class CellCultureHistory {
    id?: number;
    // tslint:disable-next-line:variable-name
    cell_event?: CellCultureEvent;
    // tslint:disable-next-line:variable-name
    cell_line?: CellCultureLine;
    // tslint:disable-next-line:variable-name
    log_type?: number;
    // tslint:disable-next-line:variable-name
    created_at?: any;
    // tslint:disable-next-line:variable-name
    ui_event_datetime?: any;
    removed?: boolean;
    latest?: boolean;
}
