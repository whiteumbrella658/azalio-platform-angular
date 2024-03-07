import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';
import { avatarOpacity } from 'src/constants';
import { config } from 'src/environments/configuration';
import { AddSurveyComponent } from '../../components/add-survey/add-survey.component';
import { SurveyService } from '../../survey.service';

@Component({
  selector: 'app-survey-page',
  templateUrl: './survey-page.component.html',
  styleUrls: ['./survey-page.component.scss']
})
export class SurveyPageComponent implements OnInit {
  searchOn: string;
  searchText: string;
  pageEvent: PageEvent;
  loading: boolean;
  paginator: any;
  emptySearchResults: boolean;
  emptyResults: boolean;
	displayedColumns: string[] = ['question', 'createdBy', 'createdOn', 'responses', 'action'];
	dataSource = new MatTableDataSource<PeriodicElement>([]);
  opacity: number;
  pageLoading: boolean;

  constructor(
    private router: Router,
    private service: SurveyService,
    private dialogService: NbDialogService,
    private gs: GeneralService) { }

  ngOnInit(): void {
    if (config.environment?.toLowerCase() === 'prod' || config.environment?.toLowerCase() === 'production') {
			this.router.navigate(['communication']);
		}
    this.pageLoading = true;
    this.opacity = avatarOpacity;
    this.gs.hideSplashScreen();
    this.getData();
  }

  openSurveyModal() {
     this.dialogService.open(AddSurveyComponent,{hasBackdrop: true, closeOnBackdropClick: false, context: {}
     }).onClose.subscribe(refresh => {
       if (refresh) {
         this.getData();
       }
     });
   }

   onSearch(searchText) {
    this.gs.logEvents('search_question_survey_page')
    this.searchOn = searchText.trim();
    this.searchText = this.searchOn;
    if (this.pageEvent) {
      this.pageEvent.pageIndex = 0;
    }
    this.getData();
  }

  getData() {
    this.loading = true;
    this.service.getSurveyTableData(this.searchText, this.pageEvent)
      .then((response) => {
        this.dataSource = response.surveys;
        this.paginator = response.pagination;
        this.emptySearchResults = response.surveys?.length === 0 && this.searchText ? true : false;
        this.emptyResults = response.surveys?.length === 0 && !this.searchText ? true : false;
     })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.pageLoading = false;
        this.loading = false;
      });
  }

  downloadReport(id) {
      this.loading = true;
      this.service.exportSurveyReport({surveyId: id})
        .then((response: any) => {
          this.gs.exportAsExcelFile(response.csvData, "Survey Report");
        })
        .catch((error) => {
          this.gs.showToastError(error.message);
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    }

    backToMessages() {
      this.router.navigate(['communication']);
    }
}


export interface PeriodicElement {
	name: string;
  createdBy: string;
  createdOn: Date;
  action: any;
}
