import { Component, Input, OnInit } from '@angular/core';
import {FirestoreService} from 'src/app/core/services/firestore.service';

@Component({
  selector: 'app-text-popup',
  templateUrl: './text-popup.component.html',
  styleUrls: ['./text-popup.component.scss']
})
export class TextPopupComponent {
  @Input() textLabel;
  @Input() text;
  @Input() image;
  @Input() imageClass;
  constructor(private analytics: FirestoreService) {
    this.imageClass = this.imageClass ? this.imageClass : '';
   }

  onImgLoad() {
    if(this.textLabel !== 'details'){
    this.analytics.logEvents("main_table_photo");
    }
    const element = document.getElementsByClassName("loading_image").item(0) as HTMLElement;
    if (element) {
      element.style.display = "none";
    }
  }

}
