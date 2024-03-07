import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {

  @Input() tableData;
  dataSource: any;

  displayedColumns: string[] = ['key1', 'key2', 'key3', 'key4'];
  displayNames: string[] = ['Item', 'Profit 2020', 'Profit 2021', 'Profit 2022'];

  constructor() {
    this.tableData = this.tableData;
   }

  ngOnInit(): void {
    this.dataSource = this.tableData.data_source;
    this.displayNames = this.tableData.columnsDisplayName;
    this.displayedColumns = this.tableData.columns;
    // this.dataSource = [
    //   { key1: 'Bread', key2: '$200', key3: '$800', key4: '$700'},
    //   { key1: 'Sugar', key2: '$0', key3: '$44', key4: '$97'},
    //   { key1: 'Juice', key2: '$824', key3: '$82', key4: '$542'},
    //   { key1: 'Bananas', key2: '$400', key3: '$200', key4: '$442'},
    //   { key1: 'Coffee', key2: '$1200', key3: '$2900', key4: '$4300'},
    // ]
  }

}
