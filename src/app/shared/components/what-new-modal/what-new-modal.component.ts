import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-what-new-modal',
  templateUrl: './what-new-modal.component.html',
  styleUrls: ['./what-new-modal.component.scss']
})
export class WhatNewModalComponent implements OnInit {
  dataSource: any;
  title: any;
  isSettingsEnabled: any;
  isSchedulerEnabled: any;
  isRecognitionEnabled: any;
  constructor(
    private router: Router,
    private ref: NbDialogRef<WhatNewModalComponent>,
    private dataService: DataSharedService) {
    this.dataService.getConfigurations(false).then((config) => {
      let roleConfig = config.role?.modules;
      this.isSettingsEnabled = roleConfig.Settings.enabled;
      this.isSchedulerEnabled = roleConfig.Schedules.enabled && config.company.is_scheduler == 1 ? true : false;
      this.isRecognitionEnabled = roleConfig.Rewards.enabled;
    }).finally(() => {
    });
  }

  ngOnInit(): void {
  }

  navigate(url) {
    this.router.navigate([url]);
    this.close(null);
  }

  close(openNext) {
    this.ref.close(openNext);
  }
}