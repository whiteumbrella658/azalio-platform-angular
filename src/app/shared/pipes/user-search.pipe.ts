import { Pipe, PipeTransform } from '@angular/core';
import { ChatListWithUser } from '../../core/services/firestore.service';

@Pipe({
  name: 'userSearch',
})
export class UserSearchPipe implements PipeTransform {
  transform(
    value: ChatListWithUser[],
    search: string
  ): ChatListWithUser[] | [-1] {
    if (!search.trim()) {
      return value;
    }
    const filiterValues = value.filter((item) =>
      item.user.name.toLowerCase().includes(search.toLowerCase())
    );
    return filiterValues.length > 0 ? filiterValues : [-1];
  }
}
