import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';
import { AiSurveyService } from '../../../survey/ai-survey.service';
const { format } = require('date-fns');

@Component({
  selector: 'app-comm-schedules',
  templateUrl: './comm-schedules.component.html',
  styleUrls: ['./comm-schedules.component.scss']
})
export class CommSchedulesComponent implements OnInit {

  @Input() parent;
  @Input() show;

  pageLoading: boolean;
  actionLoading: boolean;
  history: any;
  emptyResults: boolean;
  selectedRow: any;
  cancelText: string;

  constructor(private gs: GeneralService, private service: AiSurveyService, 
    private ref: NbDialogRef<CommSchedulesComponent>,
    ) { }

  ngOnInit(): void {
    this.pageLoading = false;
    this.getData();
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes.show && changes.show.currentValue !== changes.show.previousValue) {
  //     this.show = changes.show.currentValue;
  //     if (changes.show.currentValue == true) {
  //       this.getData();
  //     }
  //   }
  // }

  setText(el) {
    this.selectedRow = el;
    this.cancelText = "<span>You're about to cancel scheduled SMS for <b> " + this.getFutureDates(el.schedule_dates) +  "</b>" +
   " <p><span class='colored-text'>This action cannot be undone.</span> <b>Are you sure?</b></p>";
  }

  getFutureDates(dates) {
    let res = dates.filter(x => x.sent != 1).map(y => format(new Date(y.schedule_date), 'MMM dd'));
    return res.join(', ');
  }

  getData() {
    this.pageLoading = true;
    this.service.getScheduledSurveys().then((response) => {
      this.history = response.history;
      this.emptyResults = this.history && this.history.length == 0;
    }).catch((error) => {
      console.log(error)
    })
      .finally(() => {
        this.pageLoading = false;
      });
  }

  async cancelScheduledSurvey(id) {
    if (this.actionLoading) {
      return;
    }
    this.actionLoading = true;
    const data = {
      question_id: id,
    }
    try {
      const response: any = await this.service.cancelScheduledSurvey(data);
      this.getData();
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.actionLoading = false;
    }
  }

  close(openNext): void {
    this.ref.close(openNext);
  }


}
