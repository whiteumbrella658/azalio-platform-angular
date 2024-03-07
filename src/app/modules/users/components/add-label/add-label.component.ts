import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { avatarOpacity } from 'src/constants';
import { UserService } from '../../user.service';

@Component({
  selector: 'app-add-label',
  templateUrl: './add-label.component.html',
  styleUrls: ['./add-label.component.scss']
})
export class AddLabelComponent implements OnInit {
  @Input() userDetails: any;
  opacity: number;
  AddLabel: FormGroup;
  commonStores: any;
  tags: any;
  loading: boolean;
  assignedTags: any;

  constructor(
    private gs: GeneralService,
    private dataService: DataSharedService,
    private ref: NbDialogRef<AddLabelComponent>,
    private fb: FormBuilder,
    private service: UserService
    ) { 
    this.opacity = avatarOpacity;
    this.userDetails = this.userDetails;
    this.dataService.getCompanyUserTags(false).then((tags) => {
			this.tags = tags;
		});
  }

  ngOnInit(): void {
    this.gs.logEvents('add_label_popup_opened');
    this.getUserTags();
    this.AddLabel = this.fb.group({
      storesArray: new FormArray([]),
    })
    this.userDetails = this.userDetails;
    this.setCommonStores();
  }

  async getUserTags() {
    try {
      this.loading = true;
      const response: any = await this.service.getUserTags({user_id: this.userDetails.id});
      this.assignedTags = response.data;
      this.preselectForm();
    } catch (error) {
      this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
    }
  }

  preselectForm() {
    if (!this.assignedTags || this.assignedTags?.length == 0) {
      return;
    }
    this.stores.controls.forEach(store => {
      const res = this.assignedTags.filter(x=> x.region_id == store.value.regionId);
      store.get('tagName').setValue(res[0]?.tags);
    });
  }

  populateForm() {
    this.commonStores.forEach(store => {
      this.stores.push(this.fb.group({
          regionId: [store.region_id],
          regionName: [store.region_title],
          tagName: []
        })
      );
    })
  }

  get stores() {
    return this.form.storesArray as FormArray;
  }
  get form() {
    return this.AddLabel.controls;
  }

  async submit(ngForm) {
    const data = {
      user_id: this.userDetails.id,
      data: this.getSelectedTags()
    }
    try {
      this.loading = true;
      const response: any = await this.service.updateUserTags(data);
      this.gs.showToastSuccess(response?.message);     
      this.close(true); 
    } catch (error) {
      this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
    }
  }

  getSelectedTags() {
    let result = this.stores.controls.map(x => {
      const data = {region_id: x.value.regionId, tags: x.value.tagName ? x.value.tagName : []}
      return data
    });
    return result;
  }

  close(refresh = false) {
    this.ref.close(refresh);
  }

  setCommonStores() {
    // if (this.isAccountOwner || this.isPartner) {
    //   this.disableStoreIds = [];
    //   this.editableStoreIds = null //all stores are removable
    // } else {
      let ownAssignments = this.dataService.getLoggedInUserStores();
      // const differentStores = this.userDetails.assignments.filter(o1 => !ownAssignments.some(o2 => o1.id === o2.region_id));
      this.commonStores = this.userDetails.regions.filter(o1 => ownAssignments.some(o2 => o1.region_id === o2.region_id));
      this.populateForm();
      // this.disableStoreIds = differentStores.map(x => { return x.id });
      // this.editableStoreIds = commonStores.map(x => { return x.id });
      // this.commonStoreCount = commonStores.length;
    }
  // }

}
