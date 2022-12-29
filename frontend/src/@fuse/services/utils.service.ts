import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {
    
    ROLE_IGOR_ADMIN = 2;
    ROLE_COMPANY_ADMIN = 1;
    ROLE_REGULAR_USER = 0;
    
    constructor() { }
    
    parseError(response): string {
        try {
            let errorMsg = '';
            if (!response || !response.error) {
                return 'No response error';
            }
            const errorData = response.error;
            if ('detail' in errorData) {
                errorMsg = errorData.detail;
            } else {
                // tslint:disable-next-line:forin
                for (const key in errorData) {
                    errorMsg += errorData[key];
                }
            }
            if (!errorMsg) {
                errorMsg = 'Something went Wrong!';
            }
            return errorMsg;
        } catch (e) {
             const errorMsg = 'Something went Wrong!';
            return errorMsg;
        }
    }
    
    getStatTime(d): any {
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        return d;
    }
}


