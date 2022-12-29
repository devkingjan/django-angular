import {CellCultureLine} from './cell-culture-line';
import {CellCultureHistory} from './cell-culture-history';

export class CellCultureEventByDate {
    id?: number;
    time?: any;
    // tslint:disable-next-line:variable-name
    cell_lines?: CellCultureLine[];
    events?: CellCultureHistory[];
}
