import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'columnValue'
})
export class ColumnValuePipe implements PipeTransform {

    transform(value: any, ...args: any[]): unknown {
        const columnData = value[0];
        const rowData = value[1];
        const selectedColumn = columnData.find(c => c.column === rowData.id);
        if (selectedColumn) {
            if (selectedColumn.widget === 'date') {
                const value  = moment(selectedColumn.value).format('MMM DD, YYYY');
                return value;
            } else if (selectedColumn.widget === 'dropdown') {
                return selectedColumn.option_name;
            } else {
                return selectedColumn.value;
            }
        } else {
            return '';
        }
        
    }

}
