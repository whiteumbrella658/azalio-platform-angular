import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { RecognitionService } from '../../recognition.service';

@Component({
  selector: 'app-new-reward',
  templateUrl: './new-reward.component.html',
  styleUrls: ['./new-reward.component.scss']
})
export class NewRewardComponent implements OnInit {
  loading: boolean;
  form: FormGroup;
  @Input() data;
  @Input() filterInput;
  marathonPeriod: any;
  fileData: any;
  imgURL: string | ArrayBuffer;
  selectedUser: any;
  badges: any;
  selectedBadge: any;
  webUserName: any;

  constructor(
    private dataService: DataSharedService,
    private gs: GeneralService,
    private service: RecognitionService,
    private fb: FormBuilder,
    private ref: NbDialogRef<NewRewardComponent>,
  ) { 
    this.webUserName = this.dataService.getUserName();
  }

  ngOnInit(): void {
    this.selectedUser = this.data;
    this.form = this.fb.group({
      description: ['', [Validators.maxLength(255)]],
      photo: []
    });
    this.badges = this.service.getDefaultBadges();
    this.selectedBadge = this.badges[0];

  }

  submit(ngForm) {
    if (ngForm.valid) {
      this.sendReward();
    }
  }

  sendReward = async () => {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const data = {
      badge_id: this.selectedBadge.id,
      awarded_to: this.data.id, //user id
      region_id: this.filterInput?.region_id,
      note: this.form.get('description').value,
    };

    try {
      const response: any = await this.service.recogniseUser(data);
      this.gs.showToastSuccess(response?.message);
      this.close(true);
    } catch (error) {
      console.log(error);
      this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
    }
  }

  // handleFileInput = (event: any) => {
  //   this.fileData = event.target.files[0];
  //   if (this.fileData.type.includes('image')) {
  //     this.readURL(event);
  //     this.form.controls.photo.setValue(this.fileData.name);
  //     return;
  //   }
  //   this.gs.showToastWarning('Only image files allowed');
  //   return;
  // }

  //   readURL(event: any): void {
  //     if (event.target.files && event.target.files[0]) {
  //         const file = event.target.files[0];
  //         const reader = new FileReader();
  //         reader.onload = (event:any) => {
  //           this.imgURL = event.target.result;
  //       }
  //         reader.readAsDataURL(file);
  //     }
  // }

  close(openNext): void {
    this.ref.close(openNext);
  }

}
