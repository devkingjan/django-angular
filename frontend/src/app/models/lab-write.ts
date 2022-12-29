export class LabESign {
    typeInitials: string;
    password: string;
    expId: number;
}

export class LabSectionData {
    type: string;
    username: string;
    data: any;
    file_source: string;
    file_name: string;
    created_at: any;
    order: number;
    column: number;
    row: number;
}

export class LabSectionTableColumn {
    columnDef: string;
    header: string;
    cell: [];
}
