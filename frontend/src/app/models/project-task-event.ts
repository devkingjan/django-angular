import {Project} from "./project";
import {ProjectTask} from "./project-task";
import {User} from "./user";

export class ProjectTaskEvent {
    comment?: string;
    // tslint:disable-next-line:variable-name
    user_id?: number;
    // tslint:disable-next-line:variable-name
    first_name?: string;
    // tslint:disable-next-line:variable-name
    last_name?: string;
    user?: User;
    type?: string;
    project?: Project;
    task?: ProjectTask;
    // tslint:disable-next-line:variable-name
    after_project?: Project;
    // tslint:disable-next-line:variable-name
    after_task?: ProjectTask;
    // tslint:disable-next-line:variable-name
    before_project?: Project;
    // tslint:disable-next-line:variable-name
    before_task?: ProjectTask;
    description?: string;
    // tslint:disable-next-line:variable-name
    created_at?: any;
}
