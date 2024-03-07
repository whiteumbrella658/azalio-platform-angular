import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-animate-icons',
  templateUrl: './animate-icons.component.html',
  styleUrls: ['./animate-icons.component.scss'],
 //animations: [ listAnimation, listAnimation1],
  animations: [
    trigger('fade', [
      transition('false=>true', [
        style({ opacity: 0 }),
        animate('2000ms ease-out', style({ opacity: 1 })),
        
      ]),
      transition('true=>false', [
        animate('1500ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('fade2', [
      transition('false=>true', [
        style({ opacity: 0 }),
        animate('2500ms ease-out', style({ opacity: 1 })),
      ]),
      transition('true=>false', [
        animate('1500ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('fade3', [
      transition('false=>true', [
        style({ opacity: 0 }),
        animate('2300ms ease-out', style({ opacity: 1 })),
      ]),
      transition('true=>false', [
        animate('1500ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('fade4', [
      transition('false=>true', [
        style({ opacity: 0 }),
        animate('2200ms ease-out', style({ opacity: 1 })),
      ]),
      transition('true=>false', [
        animate('1500ms', style({ opacity: 0 })),
      ]),
    ]),
    trigger('fade5', [
      transition('false=>true', [
        style({ opacity: 0 }),
        animate('2400ms ease-out', style({ opacity: 1 })),
      ]),
      transition('true=>false', [
        animate('1500ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class AnimateIconsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  iconsArray = [
    'fas fa-clock timesheet',
    'fas fa-calendar-alt scheduler',
  ];
  iconsArray3 = [
    'fa fa-users large organization',
    'fas fa-comment message',
  ];
  iconsArray2 = [
    'fa fa-cog settings',
    'fa fa-tasks tasks'
  ];
  iconsArray5 = [
    'fa fa-trophy recognition',
    'fa fa-users large organization',
  ];
  // imageArray4 = [
  //   '../../../../../assets/busy-bee.png',
  //   '../../../../../assets/high-energy.png'
  // ]
  toogle = false;
  count: number = 0;

  toogle2 = true;
  count2: number = 0;

  toogle3 = true;
  count3: number = 0;

  toogle4 = true;
  count4: number = 0;

  toogle5 = true;
  count5: number = 0;

  onFade(event: any) {
    if (event.fromState) this.count = (this.count+1) % this.iconsArray.length;
    this.toogle = !this.toogle;
  }
  onFade2(event: any) {
    this.toogle2 = !this.toogle2;
    if (event.fromState)
      this.count2 = (this.count2+1) % this.iconsArray2.length;
  }
  onFade3(event: any) {
    this.toogle3 = !this.toogle3;
    if (event.fromState)
      this.count3 = (this.count3+1) % this.iconsArray3.length;
  }
  // onFade4(event: any) {
  //   this.toogle4 = !this.toogle4;
  //   if (event.fromState)
  //     this.count4 = (this.count4+1) % this.imageArray4.length;
  // }
  onFade5(event: any) {
    this.toogle5 = !this.toogle5;
    if (event.fromState)
      this.count5 = (this.count5+1) % this.iconsArray5.length;
  }

}
