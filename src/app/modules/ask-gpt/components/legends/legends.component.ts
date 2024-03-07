import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-legends',
  templateUrl: './legends.component.html',
  styleUrls: ['./legends.component.scss']
})
export class LegendsComponent implements OnInit {

  @Input() title;
  @Input() data;
  @Input() qType; //question Type

  constructor() { 
    console.log(this.data);
  }

  ngOnInit(): void {
  }
}
