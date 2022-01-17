import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'src/models';

@Pipe({
  name: 'searchitem'
})
export class SearchItemPipe implements PipeTransform {
  transform(items: any[], val: any): any {
    if (!val) { return items; }
    if (!items) { return []; }
    return items.filter(x =>
      x.Name.toLocaleLowerCase().includes(val.toLocaleLowerCase()));
  }

}
