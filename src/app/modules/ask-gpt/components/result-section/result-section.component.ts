import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { avatarOpacity } from 'src/constants';
import { AskGptService } from '../../ask-gpt.service';

@Component({
  selector: 'app-result-section',
  templateUrl: './result-section.component.html',
  styleUrls: ['./result-section.component.scss']
})
export class ResultSectionComponent implements OnInit {
  loading: boolean;
  history: any = [];
  @Input() show;
  funfact: any;
  opacity: number;

  constructor(
    public ds: DataSharedService,
    private gs: GeneralService,
    public service: AskGptService) { 
      this.getQuestionHistory();
    }

  ngOnInit(): void {
    this.opacity = avatarOpacity;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.show && changes.show.previousValue !== changes.show.currentValue) {
      this.show = changes.show.currentValue;
    }
  }

  clearHistory() {
    this.history = [];
  }

  async getQuestionHistory(id = null) {
    this.history = [];
    try {
      this.loading = true;
      const response: any = await this.service.getQuestionHistory(id);
      this.history = response.questions;
      setTimeout(() => {
        this.scrollToBottom();
      });
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  updateHistory(item, lastIndex = false): void {
    if (lastIndex) {
      this.history.pop();
    } 
    this.funfact = this.service?.getNewFact();
    this.history.push(item);
    setTimeout(() => {
      this.scrollToBottom();
    });
  }

  updateLastIndex(): void {
    this.history[this.history.length - 1]['answer'] = 'An error has occured. Please restructure your question or try again later.'
    this.history[this.history.length - 1]['isLoading'] = false;
    setTimeout(() => {
      this.scrollToBottom();
    });
  }

  scrollToBottom() {
    const elem = document.getElementById('results-wrapper');
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
    }
  }

}
