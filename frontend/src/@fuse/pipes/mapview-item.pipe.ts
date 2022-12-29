import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapviewItem'
})
export class MapviewItemPipe implements PipeTransform {

    transform(value: unknown, ...args: unknown[]): any {
        const sampleData = value[0];
        if (!sampleData || sampleData.length === 0) {
            return '';
        }
        const row = value[1];
        const column = value[2];
        const isRunningNumber = value[3];
        const horizontalLength = value[4];
        let position = null;
        let item = null;
        if (isRunningNumber) {
            position = (row - 1) * horizontalLength + column;
            item = sampleData.find(s => s.position === position.toString());
        } else {
            position = row + column;
            item = sampleData.find(s => s.position === position);
        }
        if (item) {
            let name = item.name;
            if (name.length > 15) {
                name = name.substring(0, 15) + '...';
            }
            return `<span class="bold">${name}</span><br>\n(${item.sample_uid})`;
        } else {
            return '';
        }
    }

}
