import { Component, OnInit } from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
@Component({
  selector: 'app-view-template',
  templateUrl: './view-template.component.html',
  styleUrls: ['./view-template.component.scss']
})
export class ViewTemplateComponent implements OnInit {
  nameConfig: any;

  constructor(private dataService: DataSharedService, private ref:NbDialogRef<ViewTemplateComponent>) { }

  ngOnInit(): void {
    this.dataService.getConfigurations(false).then((config) => {
      this.nameConfig = config.company?.custom_names;
    }).finally(() => {
    });
  }
  close(openNext) {
    this.ref.close(openNext);
  }
}
