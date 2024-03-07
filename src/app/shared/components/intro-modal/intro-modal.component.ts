import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';

@Component({
  selector: 'app-intro-modal',
  templateUrl: './intro-modal.component.html',
  styleUrls: ['./intro-modal.component.scss']
})
export class IntroModalComponent implements OnInit {
  slideIndex: number;
  slides: any;
  dots: any;
  selected: any;
  roleConfig: any;
  isTimesheetEnabled: any;
  isOrganizationEnabled: any;
  headings: HTMLCollectionOf<Element>;
  nameConfig: any;
  isCommunicationEnabled: any;
  isSchedulerEnabled: any;
  dotActiveColor:string;
  isTaskEnabled: any;
  isRecognitionEnabled: any;
  constructor(private dataService: DataSharedService, private ref: NbDialogRef<IntroModalComponent>) { }

  ngOnInit(): void {
    this.dotActiveColor='#7b68ee';
    this.dataService.getConfigurations(false).then((config) => {
      this.roleConfig = config.role?.modules;
      this.nameConfig = config.company?.custom_names;
      this.isTimesheetEnabled = this.roleConfig.TimesheetManagement.enabled;
      this.isTaskEnabled = config.company.is_tasks === 1 && this.roleConfig.Tasks.enabled;
      this.isRecognitionEnabled = config.company.is_rewards === 1 && this.roleConfig.Rewards.enabled;
      this.isSchedulerEnabled = config.company.is_scheduler === 1 && this.roleConfig.Schedules.enabled;
      this.isOrganizationEnabled = this.roleConfig.OrganisationManagement.enabled;
      this.isCommunicationEnabled = config.company.is_communication === 1;
      // this.isCommunicationEnabled = config.company.is_communication === 1 && this.roleConfig.Communication.enabled;
      // this.isRecognitionEnabled = config.company.is_recognition === 1 && this.roleConfig.Recognition.enabled;
    }).finally(() => {
      this.slideIndex = 1;
      this.showSlides(this.slideIndex);
    });
  }

  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n) {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n) {
    this.selected = n;
    this.slides = document.getElementsByClassName("mySlides");
    
    if (n > this.slides.length) { this.slideIndex = 1 }
    if (n < 1) { this.slideIndex = this.slides.length }
    for (let i = 0; i < this.slides.length; i++) {
      this.slides[i].style.display = "none";
    }
    this.slides[this.slideIndex - 1].style.display = "block";

    setTimeout(() => {
      this.dots = document.getElementsByClassName("dot");
      for (let i = 0; i < this.dots.length; i++) {
        this.dots[i].className = this.dots[i].className.replace(" actives", "");
      }
      this.dots[this.slideIndex - 1].className += " actives";
    }, 100);

    this.headings = document.getElementsByClassName("myHeadings");
    if (this.headings?.length > 0) {
      for (let i = 0; i < this.headings.length; i++) {
        this.headings[i].className =  this.headings[i].className.replace(" active", "");
        const elem = this.headings[i] as HTMLElement;
        elem.style.backgroundImage = '';
      }
      
      if (this.slideIndex !== 1) {
        this.headings[this.slideIndex - 2].className += " active";
        this.setAsSelected(this.slideIndex - 2);

        //if multiple tabs are needed for Timesheet
        // if (this.isTimesheetEnabled && (this.slideIndex === 2 || this.slideIndex === 3)) {
        //   this.headings[0].className += " active";
        // } else if (this.isTimesheetEnabled) {
        //   this.headings[this.slideIndex - 3].className += " active";
        // } else {
        //   this.headings[this.slideIndex - 2].className += " active";
        // }
      }
    }

  }

  close(openNext) {
    this.ref.close(openNext);
  }

  setAsSelected(n) {
    const className = this.headings[n].className;
    let item = this.headings[n] as HTMLElement;
    if (className.includes('timesheet')) {
      item.style.backgroundImage = 'radial-gradient(circle, #eff8ff, #e9f5ff, #e3f3ff, #ddf0ff, #d7edff)';
    }
    else if (className.includes('scheduler')) {
      item.style.backgroundImage = 'radial-gradient(circle, #fffdfc, #fff8f5, #fff4ef, #ffefe8, #ffeae2)';
    }
    else if (className.includes('organization')) {
      item.style.backgroundImage = 'radial-gradient(circle, #f3ffd3, #f3ffd4, #f4fed5, #f4fed7, #f4fdd8)';
    }
    else if (className.includes('messaging')) {
      item.style.backgroundImage = 'radial-gradient(circle, #fff7ff, #fef0fe, #fceafc, #fbe3fb, #f9dcf9)';
    } 
    else if (className.includes('task')) {
      item.style.backgroundImage = 'radial-gradient(circle, #f1fffd, #e7fdfa, #dcfcf7, #d1faf4, #c6f8f1)';
    }
    else if (className.includes('recognition')) {
      item.style.backgroundImage = 'radial-gradient(circle, #fffaf3, #fff7e9, #fff3de, #fff0d4, #ffedca)';
    }
  }

}
