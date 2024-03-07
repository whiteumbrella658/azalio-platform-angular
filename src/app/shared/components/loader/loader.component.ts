import { Component, Input, OnInit, SimpleChanges,OnChanges } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnChanges {

  @Input() loading;
  display: any;

  constructor() { 
    this.display = false;
  }
  options: AnimationOptions = {
    path: 'https://assets4.lottiefiles.com/packages/lf20_eb5cde4g.json'
	  };
    onAnimate(animationItem: AnimationItem): void {
      }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['loading'] && changes.loading.currentValue !== changes.loading.previousValue) {
      this.display = changes.loading.currentValue;
    }
  }

}
