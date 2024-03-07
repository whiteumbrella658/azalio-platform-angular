import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';
import { SurveyService } from '../../survey.service';

@Component({
  selector: 'app-add-survey',
  templateUrl: './add-survey.component.html',
  styleUrls: ['./add-survey.component.scss']
})
export class AddSurveyComponent implements OnInit {
  surveyTypeList = [
    { key: 'boolean', value: 'Yes/No type question' },
    { key: 'numeric', value: 'Numeric type question' },
  ]

  loading: boolean;
  AddSurveyForm: FormGroup;

  constructor(
    private service: SurveyService,
    private gs: GeneralService,
    private ref: NbDialogRef<AddSurveyComponent>,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.AddSurveyForm = this.fb.group({
      question: ['', [Validators.required, Validators.maxLength(255)]],
      surveyType: ['', Validators.required],
      assignments: ['', Validators.required],
    });
  }

  submit(ngForm) {
    this.addSurvey();
  }

  onTagSelectionChange($event) {
    const value = $event?.size > 0 ? Array.from($event) : '';
    this.AddSurveyForm.controls.assignments.setValue(value);
  }

  async addSurvey() {
    if (this.loading) {
      return;
    }
    if (this.AddSurveyForm.valid) {
      this.loading = true;
      const data =
      {
        survey_question: this.AddSurveyForm.get('question').value,
        survey_type: this.AddSurveyForm.get('surveyType').value,
        assignments: this.AddSurveyForm.get('assignments').value
      }
      try {
        const response: any = await this.service.addSurvey(data);
        this.gs.showToastSuccess(response?.message);
        this.ref.close(true);
      } catch (error) {
        this.gs.showToastError(error.message);
        console.log(error)
      } finally {
        this.loading = false;
      }
    }
  }


  close(refresh = false) {
    this.ref.close(refresh);
  }

}
