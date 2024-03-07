import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-circular-progress',
  templateUrl: './circular-progress.component.html',
  styleUrls: ['./circular-progress.component.scss']
})
export class CircularProgressComponent implements OnInit {
  testTaken: any;
  @Input() total: number;
  @Input() legend: boolean;
  @Input() active: number;
  @Input() color: string;
  @Input() textInsideCircle: string;
  percentage: number;
  constructor() { 
  }

  ngOnInit() {
      this.total = this.total ? this.total : 1;
      this.active = this.active && this.active > 0 ? Math.round(this.active) : 0
      this.percentage = Number(((this.active / this.total) * 100).toFixed(2));
  }



}
