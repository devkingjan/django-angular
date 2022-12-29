import {User} from "./user";

export class Member {
    id?: number;
    username?: string;
    email?: string;
    // tslint:disable-next-line:variable-name
    first_name?: string;
    // tslint:disable-next-line:variable-name
    last_name?: string;
    role?: string;
    initials?: string;
    // tslint:disable-next-line:variable-name
    pwd_updated?: any;
    // tslint:disable-next-line:variable-name
    emergency_first_name?: string;
    // tslint:disable-next-line:variable-name
    emergency_last_name?: string;
    // tslint:disable-next-line:variable-name
    user_info?: User;
    // tslint:disable-next-line:variable-name
    signed_avatar_url?: string;
    avatar?: string;
    status?: number;
    // tslint:disable-next-line:variable-name
    created_at?: any;
}
