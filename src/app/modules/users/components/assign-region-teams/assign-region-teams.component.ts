import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, OnChanges } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { GeneralService } from 'src/app/core/services/general.service';
import { SearchInputComponent } from 'src/app/shared/components/search-input/search-input.component';
import { UserService } from '../../user.service';



@Component({
  selector: 'app-assign-region-teams',
  templateUrl: './assign-region-teams.component.html',
  styleUrls: ['./assign-region-teams.component.scss']
})
export class AssignRegionTeamsComponent implements OnInit, OnChanges {
  @Input() nameConfig;
  @Input() refreshData;
  @Input() assignmentData;
  @Output() assignmentChange: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild(SearchInputComponent) searchField: SearchInputComponent;

  treeData: any;
  searchText: any;
  emptySearchResults: boolean;
  emptyResults : boolean;

  constructor(private service: UserService) {
  }


  ngOnInit(): void {
    if(this.assignmentData) {
      this.treeData = this.assignmentData;
    } else {
      this.getData();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.assignmentData && changes.assignmentData.currentValue) {
      this.treeData = changes.assignmentData.currentValue;
    }

    if (changes.refreshData && changes.refreshData.currentValue !== changes.refreshData.previousValue) {
      this.getData();  //change this to only clear selected
    }
  }

  async getData() {
    try {
      this.treeData = await this.service.getRegions(this.searchText);
      this.emptySearchResults = this.treeData?.length === 0 && this.searchText ? true : false;
      this.emptyResults = this.treeData?.length === 0 && !this.searchText ? true : false;
    } catch (error) {
      console.log(error)
    }
  }

  onAssignment($event) {
    this.assignmentChange.emit($event);
  }

  onSearch(searchText) {
    this.searchText = searchText.trim();
    this.getData();
  }

  clearSearchField() {
    this.searchField.clear();
  }

}
