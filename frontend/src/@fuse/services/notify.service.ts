import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import * as _ from "lodash";

@Injectable({
    providedIn: 'root'
})
export class NotifyService {
    private updatedTaskManager: BehaviorSubject<any>;
    
    constructor() {
        this.updatedTaskManager = new BehaviorSubject({position: '', state: false});
    }
    
    set refreshTaskManager(value) {
        this.updatedTaskManager.next(value);
    }
    
    get getTaskManagerUpdateState(): any | Observable<any> {
        return this.updatedTaskManager.asObservable();
    }
}
