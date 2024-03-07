import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { AskGptService } from '../../ask-gpt.service';
import { CommSchedulesComponent } from '../../components/comm-schedules/comm-schedules.component';
import { GptMessageComponent } from '../../components/gpt-message/gpt-message.component';

@Component({
  selector: 'app-emp-comm-page',
  templateUrl: './emp-comm-page.component.html',
  styleUrls: ['./emp-comm-page.component.scss']
})
export class EmpCommPageComponent implements OnInit {
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
    private askQService: AskGptService,
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataSharedService,
    private gs: GeneralService,
    private dialogService: NbDialogService
    ) { }
  

  ngOnInit(): void {
    this.showSideBar = false;
    this.dataService.getConfigurations(false).then((config) => {
      if (config.company?.is_askq !== 1) {
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
    this.askQService.getSurveyQuestions(this.searchText, this.selectedCategory)
      .then((response) => {
        this.data = response?.data;
        this.categories = response?.categories;
        this.emptySearchResults = this.searchText && this.data?.length == 0;
      }).catch((error) => {
        console.log(error)
      })
      .finally(() => {
        this.pageLoading = false;
        this.loading = false;
      });
  }

  openAddModal(data = null) {
    if (data && data.is_comming_soon == 1) {
      return;
    }
    let question = data ? data.description : this.form.value.question;
    let type = data ? data.type : null;
    let isView = data && data.is_trigger == 1 ? true : false;
		this.dialogService.open(GptMessageComponent, {
			hasBackdrop: true,
			closeOnBackdropClick: false,
			context: {class: 'askq-theme', isView: isView, text: question, type: type, imgUrl: data?.image_url, category: data?.title},
		}).onClose.subscribe((isSuccess) => {
      if (isSuccess) {
        this.form.controls.question.setValue('');
      }
		});
	}
// <app-sidebar class="scheduled-sms-sidebar" [showSideBar]="showSideBar" (closeDetails)="closeDetails()">
//   <app-comm-schedules [parent]="this" [show]="showSideBar"></app-comm-schedules>
// </app-sidebar>

  openScheduledModal() {
    this.dialogService.open(CommSchedulesComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context: { parent: this },
    }).onClose.subscribe((isSuccess) => {
      if (isSuccess) {
        // this.form.controls.question.setValue('');
      }
    });
  }

  initiateFlow() {
    if (this.form.controls.question.valid) {
      this.openAddModal();
    }
  }

  selectCategory(value) {
    console.log(value, this.selectedCategory);
    if (value !== this.selectedCategory) {
       this.selectedCategory = value;
       this.getData();
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

  // closeDetails() {
  //   this.showSideBar = false;
  //   this.gs.showBackDrop(false);  
  // }

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
    this.router.navigate(['askq/communication/history']);
  }

  async updateTrigger($event, item) {
    this.loading = true;
    const data = {
      is_enabled: $event == true ? 1 : 0,
      trigger_id: item.id
    }
    try {
      const response: any = await this.askQService.updateTrigger(data);
      this.gs.showToastSuccess(response?.message);
    } catch (error) {
      this.gs.showToastError(error.message);
      item['is_enabled'] = !$event;
    } finally {
      this.loading = false;
    }
  }

}
