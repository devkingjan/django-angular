import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

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

}


