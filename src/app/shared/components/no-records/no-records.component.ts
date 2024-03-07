import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { TextInputComponent } from '../../form-components/text-input/text-input.component';
@Component({
  selector: 'app-no-records',
  templateUrl: './no-records.component.html',
  styleUrls: ['./no-records.component.scss']
})
export class NoRecordsComponent implements OnChanges {
  @Input() display;
  @Input() animation:string;
  @Input() animation2:string;
  @Input() textMessage:string;
  message:string;
  help:string;
  @Input() isScheduler:boolean;
   displayText:string;
  show: any;
  showScheduler:boolean;
  image:string;
  altMsg:string;
  showDisplayText:string;
  option: AnimationOptions;
  option2: AnimationOptions;
  objPath = {
    tasks: 'https://assets1.lottiefiles.com/packages/lf20_0vym3slq.json',
    taskcomment: 'https://assets7.lottiefiles.com/private_files/lf30_dny2ur7b.json',
    timesheet: 'https://assets1.lottiefiles.com/packages/lf20_czywpupt.json',
    timeoff: 'https://assets7.lottiefiles.com/private_files/lf30_dny2ur7b.json',
    scheduler: 'https://assets2.lottiefiles.com/packages/lf20_ahiq6jus.json',
    announcement: 'https://assets4.lottiefiles.com/packages/lf20_dovy4vbp.json',
    automation: 'https://assets10.lottiefiles.com/packages/lf20_ofa3xwo7.json',
//     timesheet: 'https://assets10.lottiefiles.com/packages/lf20_faikiucx.json',
//     scheduler: 'https://assets1.lottiefiles.com/packages/lf20_kz2xdmu4.json',
    // organization: 'https://assets10.lottiefiles.com/packages/lf20_kz2xdmu4.json',
    organization: 'https://assets2.lottiefiles.com/packages/lf20_ahiq6jus.json',
    selectStore: 'https://assets5.lottiefiles.com/packages/lf20_bolw4tfv.json',
    selectStoreForTask: 'https://assets5.lottiefiles.com/packages/lf20_bolw4tfv.json',
    selectStoreAutomation: 'https://assets5.lottiefiles.com/packages/lf20_bolw4tfv.json',
    selectStoreForRecognition: 'https://assets5.lottiefiles.com/packages/lf20_bolw4tfv.json',
    acceptInvite:'https://assets6.lottiefiles.com/packages/lf20_vpzw63hs.json',
    registerSuccess: 'https://azal-cdn-bucket.s3.us-south.cloud-object-storage.appdomain.cloud/lottie-registration-success.json',
    activationlinkExpire:'https://azal-cdn-bucket.s3.us-south.cloud-object-storage.appdomain.cloud/link-expired.json',
    openshift:'https://assets2.lottiefiles.com/packages/lf20_ahiq6jus.json',
    bot: 'https://azal-cdn-bucket.s3.us-south.cloud-object-storage.appdomain.cloud/lottie-bot.json',
    loadingDots: 'https://azal-cdn-bucket.s3.us-south.cloud-object-storage.appdomain.cloud/lottie-3dots.json'

  }
  objPath2 = {
    arrowBottom: 'https://assets5.lottiefiles.com/packages/lf20_h0pj6rdx.json',
    arrowTop: 'https://assets5.lottiefiles.com/packages/lf20_h0pj6rdx.json'
  }
  objText = {
    timesheet: 'No timesheet entries.',
    timeoff: 'No time off requests.',
    scheduler: 'This store has no users. Go to organization to add users to your store.',
    organization: 'Use + to add users.',
    selectStore: 'Select a store to see schedules.',
    selectStoreForTask: 'Select a store to see tasks.',
    selectStoreAutomation: 'Select a store to see automations.',
    selectStoreForRecognition: 'Select a store to see users.',
    tasks: 'Team work is dream work! Add tasks for your team that they can manage through their mobile apps.',
    taskcomment: 'No tasks comment.',
    openshift: 'Enable open shift to get started.'
  }
  className = {
    arrowBottom: 'arrow-bottom',
    arrowTop: 'arrow-top'
  }
  constructor() { 
    this.animation = this.animation;
    this.animation2 = this.animation2;
    this.image = null;
    this.altMsg='No record found';
    this.message='No record has been added or assigned yet.';
    this.help='Please add a new record or contact system administrator.';

  }

	onAnimate(animationItem: AnimationItem): void {
	}
  
  ngOnChanges(changes: SimpleChanges) {
    
    if (changes['display'] && changes.display.currentValue !== changes.display.previousValue) {
      this.show = changes.display.currentValue;
  }

// if (changes['isScheduler']&& changes.isScheduler.currentValue !== changes.isScheduler.previousValue){
//   this.image='../../../../assets/no-store.svg';
//   this.altMsg='No store selected';
//   this.showScheduler=changes.isScheduler.currentValue;
//   this.help=''
//   this.message='Please select a store on the top right, to view the schedules.'
// }

if (changes['animation'] && changes.animation.currentValue != changes.animation.previousValue){
  this.option = {
    path: this.objPath[changes.animation.currentValue] //'https://assets10.lottiefiles.com/packages/lf20_faikiucx.json'
  };
  this.displayText=this.objText[changes.animation.currentValue];
}

if (changes['animation2'] && changes.animation2.currentValue != changes.animation2.previousValue){
  this.option2 = {
    path: this.objPath2[changes.animation2.currentValue] 
  };
}

if (changes['textMessage']&& changes.textMessage.currentValue !=changes.textMessage.previousValue){
  this.displayText=this.textMessage;
  }

}

}
