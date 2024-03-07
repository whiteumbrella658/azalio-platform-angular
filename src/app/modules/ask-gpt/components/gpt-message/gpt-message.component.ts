import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { AiSurveyService } from '../../../survey/ai-survey.service';

@Component({
  selector: 'app-gpt-message',
  templateUrl: './gpt-message.component.html',
  styleUrls: ['./gpt-message.component.scss']
})
export class GptMessageComponent implements OnInit {

  loading: boolean;
  botLoading: boolean;
  SurveyForm: FormGroup;
  showPreview: boolean;
  showScheduleInput: boolean = false;
  languages = [{ id: 1, title: 'English' }, { id: 2, title: 'Spanish' }, { id: 3, title: 'French' }, { id: 4, title: 'Hindi Roman' }]
  selectedLang: any = {id: 1, title: 'English'};

  @Input() text;
  @Input() isView;
  @Input() class;
  @Input() type;
  @Input() isEdit;
  @Input() imgUrl;
  @Input() category;

  surveyTypeList = [
    { key: 'Yes/No', value: 'Yes/No type question' },
    { key: 'scale', value: 'Scale from 1-10' },
    { key: 'text', value: 'Free text' },
    { key: 'NoResponse', value: 'No response required' },
  ]
  assignments: any[];
  roles: any;
  originalQuestion: any;
  displayPopup: any;
  selectedDropItem: string;

  @HostListener('document:click')
  public onClick(targetElement) {
    if (this.displayPopup) {
      this.displayPopup = false;
    }
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private service: AiSurveyService,
    private dataService: DataSharedService,
    public gs: GeneralService,
    private fb: FormBuilder,
    private ref: NbDialogRef<GptMessageComponent>,
  ) {

    this.dataService.getRoles(false).then((roles) => {
      this.roles = roles;
    }).finally(() => { });
  }

  // ngAfterViewChecked(): void {
  //   this.changeDetectorRef.detectChanges();
  // }

  isThereOneFieldFilled: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const stores = control.get('stores');
    const isAllStores = control.get('isAllChecked');

    if (stores && stores.value && stores.value.length >= 1) {
      return null;
    }

    if (isAllStores && isAllStores.value == true) {
      return null;
    }

    return { userOrStoreRequired: true };
  }


  ngOnInit(): void {
    this.showPreview = false;
    this.imgUrl = this.imgUrl;
    this.text = this.text;
    this.assignments = [];
    this.loading = false;
    this.botLoading = false;
    this.SurveyForm = this.fb.group({
      question: [this.text ? this.text : '', Validators.required],
      surveyType: [this.type ? this.type : 'text', Validators.required],
      stores: [null],
      datesArray: new FormArray([this.fb.group({
        value: [null],
        })
      ]),       
      isAllChecked: [false],
      isAnonymous: [false],
    }, { validators: [this.isThereOneFieldFilled] });
    if (!this.type && !this.isView) {
      this.getAIGeneratedQuestion();
    }
    setTimeout(() => {
      this.showScheduleInput = true;
    });
    // this.populateDates();
    // this.addDate();
  }

  hideShowPopup() {
    this.displayPopup = !this.displayPopup
  }

  getMinDate() {
    return new Date();
  }

  getSelectedDates(i = null) {
    let result = this.dates.controls.map((x, index) => {
      if (x.value.value && index !== i) {
        return x.value.value?.toISOString();
      };
    }).filter(x => x !== undefined)
    return result;
  }

  addDate() {
    if (this.dates.length > 11) {
      return;
    }
    this.dates.push(
      this.fb.group({
        value: [''],
      })
    );
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  scrollToBottom() {
    const elem = document.getElementById('dates-wrapper');
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
    }
  }

  filter = (i) => (date) => {
    if (date == 'Invalid Date') {
      return true;
    } else if (this.getSelectedDates(i).some((d) => d === date.toISOString())) {
      return false;
    } else {
      return true;
    }
  }

  removeRow(i) {
    this.dates.removeAt(i);
  }

  get dates() {
    return this.formc.datesArray as FormArray;
  }

  get formc() {
    return this.SurveyForm.controls;
  }

  askAnotherWay() {
    if (this.SurveyForm.controls.question.valid) {
      this.getAIGeneratedQuestion();
    } else {
      console.log("ERROR!!!!");
    }
  }

  onSend() {
    if (this.SurveyForm.valid) {
      this.createSurvey();
    }
  }

  get form() { return this.SurveyForm.controls }

  submit(ngForm) {
    if (this.SurveyForm.valid) {
      this.showPreview = true;
    }
  }

  async createSurvey() {
    if (this.loading) {
      return;
    }
    this.loading = true;
    let form = this.SurveyForm.controls;
    let stores = form.stores.value?.filter((element) => {
      if (element.type == 'Region') { return true; }
      return false;
    }).map((element) => {
      return element.id;
    })
    let users = form.stores.value?.filter((element) => {
      if (element.type == 'User') { return true; }
      return false;
    }).map((element) => {
      return element.id;
    })
    let roles = form.stores.value?.filter((element) => {
      if (element.type == 'Role') { return true; }
      return false;
    }).map((element) => {
      return element.id;
    })
    const data = {
      question: form.question.value,
      type: form.surveyType.value,
      stores: stores ? stores : null,
      roles: roles ? roles : null,
      users: users ? users : null,
      schedule_dates: this.getSelectedDates(),
      all_stores: form.isAllChecked.value,
      is_anonymous: form.surveyType.value !== 'NoResponse' ? form.isAnonymous.value : false
      // expiry_time: "2023-10-15T08:01:36.000Z"
    }
    try {
      const response: any = await this.service.createSurvey(data);
      this.gs.showToastSuccess(response?.message);
      this.showPreview = false;
      this.close(true);
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  translate(lang) {
    this.selectedLang = lang;
    this.getAITranslation(lang.title);
  }

  revertText() {
    this.SurveyForm.controls.question.setValue(this.originalQuestion);
    this.selectedLang = { id: 1, title: 'English' };
    this.originalQuestion = '';
  }

  async getAITranslation(lang) {
    let question = this.SurveyForm.controls.question.value;
    if (this.botLoading) {
      return;
    }
    if (question) {
      this.botLoading = true;
      const data = {
        text: question,
        translate_to: lang
      }
      try {
        const response: any = await this.service.getAITranslation(data);
        if (!this.originalQuestion) {
          this.originalQuestion = this.SurveyForm.controls.question.value;
        }
        this.SurveyForm.controls.question.setValue(response.translation);
      } catch (error) {
        this.gs.showToastError(error.message);
        console.log(error)
      } finally {
        this.botLoading = false;
      }
    }
  }

  async getAIGeneratedQuestion() {
    let question = this.SurveyForm.controls.question.value;
    if (this.botLoading) {
      return;
    }
    if (question) {
      this.botLoading = true;
      const data = {
        language: this.selectedLang?.title,
        question_text: question,
      }
      try {
        const response: any = await this.service.getAIGeneratedQuestion(data);
        this.handleResponse(response)
      } catch (error) {
        this.gs.showToastError(error.message);
        console.log(error)
      } finally {
        this.botLoading = false;
      }
    }
  }

  handleResponse(data) {
    if (data.question) {
      this.SurveyForm.controls.question.setValue(data.question);
      const res = this.surveyTypeList.filter(item => item.key == data.question_type);
      this.selectedDropItem = null;
      setTimeout(() => {
        this.form.surveyType.setValue(res?.length > 0 ? res[0].key : '');
        this.selectedDropItem =  res?.length > 0 ? res[0].key : '';
      }, 30);
    }
  }

  onTagSelectionChange($event) {
    if ($event == null) {
      return;
    }
    setTimeout(() => {
      const value = $event?.size > 0 ? Array.from($event) : '';
      this.SurveyForm.controls.stores.setValue(value);
    });

  }

  close(openNext): void {
    if (this.showPreview) {
      this.showPreview = false;
      return;
    }
    this.ref.close(openNext);
  }

  onSave() {
    
  }


}
