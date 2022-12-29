import {ProjectTask} from "./project-task";
import {Member} from "./member";

export class Project {
    id: number;
    name: string;
    members: any;
    // tslint:disable-next-line:variable-name
    member_list: Member[];
    tasks: ProjectTask[];
    // tslint:disable-next-line:variable-name
    is_owner?: boolean;
    status?: string;
}
