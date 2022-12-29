import { NgModule } from '@angular/core';

import { KeysPipe } from './keys.pipe';
import { GetByIdPipe } from './getById.pipe';
import { HtmlToPlaintextPipe } from './htmlToPlaintext.pipe';
import { FilterPipe } from './filter.pipe';
import { CamelCaseToDashPipe } from './camelCaseToDash.pipe';
import { ColumnValuePipe } from './column-value.pipe';
import { MapviewItemPipe } from './mapview-item.pipe';
import { OrderDatePipe } from './order-date.pipe';

@NgModule({
    declarations: [
        KeysPipe,
        GetByIdPipe,
        HtmlToPlaintextPipe,
        FilterPipe,
        CamelCaseToDashPipe,
        ColumnValuePipe,
        MapviewItemPipe,
        OrderDatePipe,
    ],
    imports     : [],
    exports     : [
        KeysPipe,
        GetByIdPipe,
        HtmlToPlaintextPipe,
        FilterPipe,
        ColumnValuePipe,
        CamelCaseToDashPipe,
        MapviewItemPipe,
        OrderDatePipe
    ]
})
export class FusePipesModule
{
}
