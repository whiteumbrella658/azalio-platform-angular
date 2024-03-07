import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataSharedService } from '../services/data-shared.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }

}
