import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { avatarOpacity, pageSizeOptions } from 'src/constants';
import { AiSurveyService } from '../../../survey/ai-survey.service';
export const paginatorOptions = {
  page_no: 1,
  page_size: pageSizeOptions[1],
  total_records: 0
}

@Component({
  selector: 'app-responses-page',
  templateUrl: './responses-page.component.html',
  styleUrls: ['./responses-page.component.scss']
})
export class ResponsesPageComponent implements OnInit {
  searchOn: string;
  searchText: string;
  pageEvent: PageEvent = {pageIndex: 0, pageSize: 10, length: 0};
  loading: boolean;
  paginator: any;
  emptySearchResults: boolean;
  emptyResults: boolean;
  displayedColumns: string[] = ['name', 'role', 'store', 'status', 'respondedAt', 'responses'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  opacity: number;
  pageLoading: boolean;
  regions: any;
  pageSizes: number[];
  form: FormGroup;
  filters: any;
  roles: any;
  isFiltered: { role: boolean; store: boolean };
  questionList: any[];
  summary: any;
  storeSummary: any;
  stores: any;
  defaultOpen: boolean = true;
	defaultOpen2: boolean = true;
  isAnonymous: boolean;
  anonymousResponses: any;
  allSummary: any;
  graph: any;
  legends: any;
  numberOfPages: number;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AiSurveyService,
    private gs: GeneralService,
    private dataService: DataSharedService
  ) {
    this.filters = { role: null, name_sort: 1 };
    this.isFiltered = {role: false, store: false};
    this.pageSizes = pageSizeOptions;
    this.dataService.getRoles(false).then((roles) => {
      this.roles = roles;
    }).finally(() => { });
  }

  ngOnInit(): void {
    this.dataService.getConfigurations(false).then((config) => {
      if (config.company?.is_askq !== 1) {
        this.router.navigate(['401']) 
      return;
    }
    }).finally(() => {
      setTimeout(() => {
        this.stores = this.dataService.getLoggedInUserStores();
      }, 3000);
      this.gs.hideSplashScreen();
    });
    this.paginator = paginatorOptions;
    this.pageLoading = true;
    this.opacity = avatarOpacity;
		this.form = this.fb.group({
			role: [],
      store: [],
      question: ['']
		})
    this.getData();
	}

  ngAfterViewInit() {
  }
	goToPage(num) {
    if (num == this.paginator.page_no - 1) {
      return;
    }
		this.pageEvent.pageIndex = num;
		this.getData();
	  }

  resetCols() {
    if (this.isAnonymous || this.summary?.question_type == 4) {
      this.displayedColumns = ['name', 'role', 'store', 'status'];
    } else {
      this.displayedColumns = ['name', 'role', 'store', 'status', 'respondedAt', 'responses'];
    }
  }

  setPagintorStyles () {
    let pages = Math.ceil(this.paginator.total_records/this.paginator.page_size);
    this.numberOfPages = pages < 6 ? pages : 5;
    let elem = document.getElementsByClassName('mat-paginator-navigation-previous')[0] as HTMLElement;
    let elem2 = document.getElementsByClassName('mat-paginator-navigation-first')[0] as HTMLElement;
      let base = 84; let size = 43;
      let sum = base + (this.numberOfPages * size);
      elem.style.right = sum + this.numberOfPages + 'px';
      elem2.style.right = sum + size + this.numberOfPages + 'px'
  }

	closeFilter(key) {
		this.form.controls[key].setValue(this.filters?.[key]);
	}

  OnHover(element){
    this.regions = element?.regions?.map((region)=>region.region_title).join(', ');
  }	
  onSearch(searchText) {
    this.searchOn = searchText.trim();
    this.searchText = this.searchOn;
    if (this.pageEvent) {
      this.pageEvent.pageIndex = 0;
    }
    this.getData();
  }

	onSort(val, key) {
		this.filters[key] = val;
		this.getData();
	}

  getData() {
    this.loading = true;
    let questionId = this.form.get('question').value;
    this.legends = null;
    this.service.getSurveyResponses(this.searchText, this.pageEvent, this.filters, questionId)
      .then((response) => {
        let filtered = false;
				for (const key in this.isFiltered) {
					if (this.isFiltered[key] == true) {
						filtered = true;
						break;
				}}
        this.isAnonymous = response.is_anonymous == 1 ? true: false;
        this.anonymousResponses = response.anonymous_responses;
        this.summary = response.summary;
        this.graph = response.graph_data ? response.graph_data : null;
        this.resetCols();
        if (!questionId) {
          this.questionList = response.all_questions;
        }
        this.form.controls.question.setValue(response.question_id);
        this.dataSource = response.users_responses;
        if (this.summary.question_type == 2) {
          this.legends = response.emp_count ? response.emp_count : null;
        } else if (this.summary.question_type == 3) {
          this.legends = response.topics_count? response.topics_count : null;
        }
        // this.storeSummary = response.storewise_summary;
        this.allSummary = response.allstore_summary;
        if (this.allSummary) {
          this.allSummary['count_all'] = response.allstore_summary.count_no + response.allstore_summary.count_yes;
        }
        this.paginator = response.pagination;
        this.setPagintorStyles();
        this.emptySearchResults = response.users_responses?.length === 0 && (this.searchText || filtered) ? true : false;
        this.emptyResults = response.users_responses?.length === 0 && (!this.searchText && !filtered) ? true : false;
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.pageLoading = false;
        this.loading = false;
      });
  }

  async resendSMS(smsId) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    try {
      const response: any = await this.service.resendSMS({ id: smsId });
      this.gs.showToastSuccess(response?.message);
      this.getData();
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  onQuestionSelection() {
    this.pageEvent.pageIndex = 0;
    this.getData();
  } 

  displayStores(el) {
		return el.stores?.join(', ');
	}

  applyFilterMulti(key) {
		let val = this.form.controls[key].value;
		if (val && val.length > 0) {
			this.isFiltered[key] = true;
			this.filters[key] = val;
		} else {
			this.filters[key] = null;
			this.isFiltered[key] = false;
		}
		this.getData();
	}

	// applyFilter(key) {
	// 	this.gs.logEvents('users_filtered_by_' + key + '_organisation')
	// 	let val = this.form.controls[key].value;
	// 	if (val && val.length > 0) {
	// 		this.isFiltered[key] = true;
	// 		this.filters[key] = val;
	// 	} else {
	// 		this.filters[key] = null;
	// 		this.isFiltered[key] = false;
	// 	}
	// 	this.getData();
	// }

	removeFilter(key) {
		this.filters[key] = null;
		this.isFiltered[key] = false;
		this.getData();
	}

  calcPerc() {
    let perc = (this.summary.total_responses/this.summary.total_questions_sent)*100;
    return Math.round(perc*100)/100;
  }

  // downloadReport(id) {
  //   this.loading = true;
  //   this.service.exportSurveyReport({ surveyId: id })
  //     .then((response: any) => {
  //       this.gs.exportAsExcelFile(response.csvData, "Survey Report");
  //     })
  //     .catch((error) => {
  //       this.gs.showToastError(error.message);
  //       console.log(error);
  //     })
  //     .finally(() => {
  //       this.loading = false;
  //     });
  // }

  backToSurvey() {
    this.router.navigate(['askq/communication']);
  }
  
}

export interface PeriodicElement {
  name: string;
  createdBy: string;
  createdOn: Date;
  action: any;
}


