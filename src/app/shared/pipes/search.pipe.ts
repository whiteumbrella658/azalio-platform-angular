import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(arr: any, searchText: string, key: string): unknown {
    if (!searchText.trim()) {
      return arr;
    }
    const filterValues = arr.filter((item) =>
      item[key].toLowerCase().includes(searchText.toLowerCase())
    );
    return filterValues.length > 0 ? filterValues : [];  }

}
