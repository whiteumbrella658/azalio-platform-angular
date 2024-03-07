import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-enable-play',
  templateUrl: './enable-play.component.html',
  styleUrls: ['./enable-play.component.scss']
})
export class EnablePlayComponent implements OnInit {
  @Input() companyId;
  loading: boolean;
  form: FormGroup;
  radioData: any = [
    {value: '3', label: '3-digit'},
    {value: '4', label: '4-digit'},
    {value: '5', label: '5-digit'}
  ]

  radioData2: any = [
    {value: '1', label: 'Automatically'},
    {value: '0', label: 'Manually'},
  ]

  constructor(
    private ref: NbDialogRef<EnablePlayComponent>, 
    private fb: FormBuilder,
    private dialogService: NbDialogService, 
    private service: AdminService, 
    private gs: GeneralService
  ) { }

  ngOnInit(): void {
    this.addFormValues();
  }

  addFormValues = () => {
    this.form = this.fb.group({
      pinLength: ['4', Validators.required],
      autoPin: ['1', Validators.required]
    });
  }

  async submit(ngForm) {
    if (this.loading) {
      return;
    }
    this.loading = true;
    const data = {
      company_id: this.companyId,
      is_azalio_play: 1,
      azalio_play_user_pin_length: Number(this.form.get('pinLength').value),
      azalio_play_user_pin_autogenerate: Number(this.form.get('autoPin').value)
    };
    try {
      const response: any = await this.service.updateCustomerSettings(data);
      this.gs.showToastSuccess(response?.message);
      this.close(true);
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  close(refresh = null) {
    this.ref.close(refresh);
  }
}
