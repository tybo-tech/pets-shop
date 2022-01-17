import { Pipe, PipeTransform } from '@angular/core';
import { Product, User } from 'src/models';

@Pipe({
  name: 'searchuser'
})
export class SearchUserPipe implements PipeTransform {

  transform(users: User[], val: any): any {

    if (!val) { return users; }
    if (!users) { return []; }
    return users.filter(x =>
      x.Name.toLocaleLowerCase().includes(val.toLocaleLowerCase()) ||
      (x.Surname || '').includes(val) ||  (x.Email || '').includes(val) ||  (x.PhoneNumber || '').includes(val));
  }

}
