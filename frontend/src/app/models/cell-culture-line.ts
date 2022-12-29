import {User} from "./user";
import {CellCultureEvent} from "./cell-culture-event";

export class CellCultureLine {
    id?: number;
    uid?: string;
    name?: string;
    origin?: string;
    // tslint:disable-next-line:variable-name
    generic_modification?: string;
    // tslint:disable-next-line:variable-name
    how_started?: string;
    // tslint:disable-next-line:variable-name
    received_scientist?: string;
    // tslint:disable-next-line:variable-name
    cloned_cell_line?: number;
    // tslint:disable-next-line:variable-name
    cloned_cell?: string;
    // tslint:disable-next-line:variable-name
    date_taken?: any;
    // tslint:disable-next-line:variable-name
    passage_number?: number;
    // tslint:disable-next-line:variable-name
    origin_passage_number?: number;
    // tslint:disable-next-line:variable-name
    culture_medium?: string;
    // tslint:disable-next-line:variable-name
    medium_additive?: string;
    // tslint:disable-next-line:variable-name
    mycoplasmas_state?: string;
    // tslint:disable-next-line:variable-name
    mycoplasmas_date?: any;
    // tslint:disable-next-line:variable-name
    culture_property?: string;
    // tslint:disable-next-line:variable-name
    current_status?: CellCultureLine;
    // tslint:disable-next-line:variable-name
    latest_update?: any;
    // tslint:disable-next-line:variable-name
    user_id?: number;
    user?: User;
    note: string;
    events?: CellCultureEvent[];
}
