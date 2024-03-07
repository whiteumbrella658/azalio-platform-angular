import { Input, SimpleChanges } from '@angular/core';
import { Component, OnChanges } from '@angular/core';

@Component({
  selector: 'app-online-status',
  templateUrl: './online-status.component.html',
  styleUrls: ['./online-status.component.scss']
})
export class OnlineStatusComponent implements OnChanges {

  @Input() message: string;
  @Input() onlineStatus: string;
  
  constructor() { }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['onlineStatus'] && changes['onlineStatus'].currentValue !== null) {
      this.onlineStatus = changes['onlineStatus'].currentValue;
      if (this.onlineStatus === 'online') {
        setTimeout(() => {
          this.onlineStatus = 'constant';
        }, 1000);
      }
    }
  }
}
