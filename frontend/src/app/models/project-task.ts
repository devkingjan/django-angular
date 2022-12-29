import {Member} from "./member";

export class ProjectTask {
    id: number;
    title: string;
    description: string;
    members: any;
    // tslint:disable-next-line:variable-name
    member_list: Member[];
    status: string;
    // tslint:disable-next-line:variable-name
    start_time: any;
    // tslint:disable-next-line:variable-name
    end_time: any;
}
