import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service'
import { AskGptService } from '../../ask-gpt.service';
import { ResultSectionComponent } from '../../components/result-section/result-section.component';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { GptMessageComponent } from '../../components/gpt-message/gpt-message.component';

@Component({
  selector: 'app-ask-gpt-page',
  templateUrl: './ask-gpt-page.component.html',
  styleUrls: ['./ask-gpt-page.component.scss']
})
export class AskGptPageComponent implements OnInit, AfterViewChecked {
  @ViewChild(ResultSectionComponent)
  private ResultSectionComponentInstance: ResultSectionComponent;

  @ViewChild(SideMenuComponent)
  private SideMenuComponentInstance: SideMenuComponent;

  iconPath = {
    'Sales' : 'assets/icon1.png',
    'Inventory': 'assets/icon2.png',
    'Employees': 'assets/icon3.png'
  }
  results: boolean;
  inputText: string = '';
  loading: boolean;
  data: any;
  suggestions: any;
  showResultSection: boolean;
  automatedActions: any;
  actionLoading: boolean = false;
  selectedConversationId: any;
  funFacts: any;

  constructor(
    private router: Router,
    private dataService: DataSharedService,
    private gs: GeneralService,
    private service: AskGptService,
    private dialogService: NbDialogService
    ) { }

  ngOnInit(): void {
    this.dataService.getConfigurations(false).then((config) => {
      if (config.company?.is_askq !== 1) {
          this.router.navigate(['401']) 
        return;
      }
    }).finally(() => {
      this.gs.hideSplashScreen();
      this.getHomePageData();
    });

    this.service.getFunFacts(false).then((response) => {
      this.funFacts = response;
    }).finally(() => {});
  }

  ngAfterViewChecked(): void {}

  setText(item) {
    this.inputText = item.question;
  }

  async getHomePageData() {
    try {
      this.loading = true;
      const response: any = await this.service.getHomePageData();
      // this.data = response.summary;
      this.suggestions = response.suggestions_list;
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  async askQuestion() {
    if (this.actionLoading) {
      return;
    }
    let data = {
      question: this.inputText,
      conversation_id: this.selectedConversationId
    }
    let convoId = this.selectedConversationId;
    if (this.inputText?.length < 1) {
      return;
    }
    try {
      this.actionLoading = true;
      this.showResultSection = true;
      this.results = true;
      this.ResultSectionComponentInstance.updateHistory(
        {
          question: this.inputText,
          isLoading: true
        });

      const response: any = await this.service.askQuestion(data);
      this.automatedActions = null;
      response['question'] = data.question;
      this.ResultSectionComponentInstance.updateHistory(response, true);
      this.automatedActions = response.actions?.length > 0 ? response.actions : null;
      if (!convoId) {
        let convo = {
          id: response.conversation_id,
          title: response.conversation_title ? response.conversation_title : response.question
        }
        // this.selectedConversationId = response.conversation_id;
        this.SideMenuComponentInstance.updateConversationList(convo);
        this.viewHistory(convo.id);
      } else if (convoId !== this.selectedConversationId) {
        this.SideMenuComponentInstance.updateSelection(convoId);
        this.viewHistory(convoId);
      }
      if (this.automatedActions) {
        this.gs.scrollToBottom('section-right');
      }
      this.showResultSection = true;
      this.results = true;
      this.inputText = '';
      data = null;
    } catch (error) {
      console.log(error)
      this.ResultSectionComponentInstance.updateLastIndex();
      this.gs.showToastError(error.message);
    } finally {
      this.actionLoading = false;
    }
  }

  openAddModal(data = null) {
    this.dialogService.open(GptMessageComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      context: { class: 'askq-theme', text: data, type: null, imgUrl: null, category: null },
    }).onClose.subscribe((isSuccess) => {
      if (isSuccess) {
        // this.form.controls.question.setValue('');
      }
    });
  }

  onNewChat() {
    this.selectedConversationId = null;
    this.results = false;
    this.showResultSection = false;
    this.ResultSectionComponentInstance.clearHistory();
  }

  viewHistory(id = null) {
    let prevId = this.selectedConversationId;
    if (id) {
      this.selectedConversationId = id;
      this.results = true;
    } else {
      this.results = !this.results;
    }
    if (this.results && prevId !== id) {
      // if (this.actionLoading) {
      //   setTimeout(() => {
      //     this.ResultSectionComponentInstance.scrollToBottom();
      //   });
      // } else {
        this.ResultSectionComponentInstance.getQuestionHistory(id);
      // }
      this.showResultSection = true;
    } else {
        setTimeout(() => {
          this.ResultSectionComponentInstance.scrollToBottom();
       });
    }
  }

  showResults() {
    this.askQuestion();
  }

  getGreeting() {
    let hours = new Date().getHours();
    switch (true) {
      case (hours < 12):
        return 'Good Morning';
      case (hours < 15):
        return 'Good Afternoon';
      case (hours < 19):
        return 'Good Evening';
      default:
        return 'Hi There!';
    }
  }

}
