import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { RecognitionService } from '../../recognition.service';

@Component({
  selector: 'app-extra-points',
  templateUrl: './extra-points.component.html',
  styleUrls: ['./extra-points.component.scss']
})
export class ExtraPointsComponent implements OnInit {
  @Input() user;
  @Input() manualPoints;
  loading: boolean;
  webUserName: any;

  constructor(
    private dataService: DataSharedService,
    private gs: GeneralService,
    private service: RecognitionService,
    private ref: NbDialogRef<ExtraPointsComponent>
  ) { }

  ngOnInit(): void {
    this.user = this.user;
    this.webUserName = this.dataService.getUserName();
  }

  close(openNext): void {
    this.ref.close(openNext);
  }

  sendReward = async () => {
    const data = {user_id: this.user.id};
    try {
      this.loading = true;
      const response: any = await this.service.recogniseUser(data);
      this.gs.showToastSuccess(response?.message);
      this.close(null);
    } catch (error) {
      console.log(error);
      this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
    }
  }

}
