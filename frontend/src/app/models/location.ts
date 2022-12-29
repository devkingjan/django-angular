export class StorageLocation {
    database: number;
    // tslint:disable-next-line:variable-name
    storage_temperature: number;
    equipment: number;
    // tslint:disable-next-line:variable-name
    allocate_tower: number;
    // tslint:disable-next-line:variable-name
    storage_type: string;
    // tslint:disable-next-line:variable-name
    allocate_number: number;
    position: number;
    allocateNumbers: any;
    // tslint:disable-next-line:variable-name
    vertical_number: number;
    // tslint:disable-next-line:variable-name
    horizontal_number: number;
    // tslint:disable-next-line:variable-name
    define_location: string;
    // tslint:disable-next-line:variable-name
    positionTitle = 'Position:';
    checkPosition = false;
    constructor(database = null) {
        this.database = database;
    }
}
