import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { AiSurveyService } from '../../ai-survey.service';
import { CreateSurveyComponent } from '../../components/create-survey/create-survey.component';
@Component({
  selector: 'app-ai-survey-page',
  templateUrl: './ai-survey-page.component.html',
  styleUrls: ['./ai-survey-page.component.scss']
})
export class AiSurveyPageComponent implements OnInit {

  form: FormGroup;
  loading: boolean;
  searchText: any;
  pageLoading: boolean;
  data: any;
  categories: any;
  selectedCategory: any;
  searchOn: any;
  showSideBar: boolean;
  types: string[];
  emptySearchResults: boolean;

  constructor(
    private service: AiSurveyService,
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataSharedService,
    private gs: GeneralService,
    private dialogService: NbDialogService
    ) { }
  

  ngOnInit(): void {
    this.showSideBar = false;
    this.dataService.getConfigurations(false).then((config) => {
      if (config.company?.interactive_communication!== 1) {
          this.router.navigate(['401']) 
        return;
      }
    }).finally(() => {
    });
    this.gs.hideSplashScreen();
    this.form = this.fb.group({
      question: ['', Validators.required],
    });
    this.getData();
  }
  getData() {
    this.pageLoading = true;
    this.service.getSurveyQuestions(this.searchText)
      .then((response) => {
        this.categories = response?.categories;
        this.emptySearchResults = response.categories?.length === 0 && this.searchText  ? true : false;
        this.selectedCategory = this.categories[0];
      }).catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.pageLoading = false;
        this.loading = false;
      });
  }

  openAddModal(data = null) {
    let question = data ? data.description : this.form.value.question;
    let type = data ? data.type : null;
		this.dialogService.open(CreateSurveyComponent, {
			hasBackdrop: true,
			closeOnBackdropClick: false,
			context: {text: question, type: type, imgUrl: data?.img_url, category: data?.title},
		}).onClose.subscribe((isSuccess) => {
      if (isSuccess) {
        this.form.controls.question.setValue('');
      }
		});
	}

  selectCategory(category) {
    this.selectedCategory = category;
  }

  initiateFlow() {
    if (this.form.controls.question.valid) {
      this.openAddModal();
    }
  }

  onSearch(searchText) {
    this.gs.logEvents('search_task')
    this.searchOn = searchText.trim();
    this.searchText = this.searchOn;
    this.getData();
  }

  onSearchAll(searchText) {
    this.searchOn = searchText.trim();
  }

  closeDetails() {
    this.showSideBar = false;
    this.gs.showBackDrop(false);  
  }

  displayQuestionType(type) {
    switch (type) {
      case 'scale':
        return '1-10';
      case 'text':
        return 'Free text';
      case 'NoResponse':
        return 'Information';
      default:
        return type
    } 
  }

  goToResponses() {
    this.router.navigate(['/survey/history']);
  }

}
