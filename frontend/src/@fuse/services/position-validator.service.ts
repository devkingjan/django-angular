import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PositionValidatorService {
    rowArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    constructor() { }
    validatePosition(location: any, position): boolean {
        if (location.define_location === 'by_running_numbers') {
            const maxPosition = location.vertical_number * location.horizontal_number;
            if (parseInt(position, 10) > 0 && parseInt(position, 10) <= maxPosition) {
                return true;
            } else {
                return false;
            }
        } else if (location.define_location === 'by_letter_number'){
            const sampleRows = this.rowArray.slice(0, location.horizontal_number);
            const sampleColumns = [];
            for (let i = 1; i <= location.vertical_number; i++) {
                sampleColumns.push(i);
            }
            const positions = [];
            sampleRows.forEach(row => {
                sampleColumns.forEach(column => {
                   positions.push(`${row}${column}`);
                });
            });
            if (positions.indexOf(position) !== -1) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    getRange(location: any): any {
        if (location.define_location === 'by_running_numbers') {
            const maxPosition = location.vertical_number * location.horizontal_number;
            return [1, maxPosition];
        } else if (location.define_location === 'by_letter_number'){
            const sampleRows = this.rowArray.slice(0, location.horizontal_number);
            const sampleColumns = [];
            for (let i = 1; i <= location.vertical_number; i++) {
                sampleColumns.push(i);
            }
            const positions = [];
            sampleRows.forEach(row => {
                sampleColumns.forEach(column => {
                   positions.push(`${row}${column}`);
                });
            });
            return [positions[0], positions[positions.length - 1]];
        } else {
            return null;
        }
    }
}
