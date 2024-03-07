import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-no-search-records',
  templateUrl: './no-search-records.component.html',
  styleUrls: ['./no-search-records.component.scss']
})
export class NoSearchRecordsComponent implements OnChanges {
  @Input() display;
  show: any;

  constructor() { }
  option:AnimationOptions = {
    // path: 'https://assets6.lottiefiles.com/packages/lf20_sftiif8f.json'
    // path: 'https://assets10.lottiefiles.com/packages/lf20_wbu6cihs.json'
    // path: 'https://assets1.lottiefiles.com/packages/lf20_ezoaqhyr.json'
    path: 'https://assets7.lottiefiles.com/private_files/lf30_dny2ur7b.json'

    };
    onAnimate(animationItem: AnimationItem): void {
      }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['display'] && changes.display.currentValue !== changes.display.previousValue) {
      this.show = changes.display.currentValue;
    }
  }

}
