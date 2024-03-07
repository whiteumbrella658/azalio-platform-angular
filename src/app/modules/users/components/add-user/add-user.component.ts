import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/core/services/general.service';
import { UserService } from '../../user.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { avatarOpacity, emailRegex } from 'src/constants';
import { FirestoreService } from 'src/app/core/services/firestore.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  providers: [NbDialogService],
})
export class AddUserComponent implements OnInit {
  @ViewChild('ngForm') ngForm: NgForm;
  @Output() nestedClick: EventEmitter<null> = new EventEmitter<null>();
  @Output() formSuccess: EventEmitter<null> = new EventEmitter<null>();
  // @Input() selectedRegions;
  @Input() userDetails;
  @Input() openAddView;
  @Input() regionId: any;
  @Input() roleId: any;
  // @Input() nameConfig;
  selected: any;
  AddUserForm: FormGroup;
  @Input() resetAddUserFormToggle: Boolean;
  phoneRequired: Array<boolean> = new Array();
  emailRequired: Array<boolean> = new Array();
  azalioPinRequired: Array<boolean> = new Array();
  loading: Boolean;
  regionData: any = null;
  userRegionData: any = null;
  user_id: number;
  showDelete: Boolean = false;
  nameConfig: any;
  roles: any;
  defaultAssignment: string[];
  anotherUser: string;
  opacity: number;
  isTeam: boolean;
  placeholder: any;
  buttonLabel: string = 'Add';
  isCreateAnother: boolean = false;
  isPartner: number = 0;
  isAccountOwner: boolean;
  pinInputType: string;
  rolesLoading: boolean;
  isEditingAccountOwner: boolean;
  isAllChecked: boolean;
  commonStoreCount: number;
  disableStoreIds: any;
  editableStoreIds: any;
  roleTitle: any;
  isCustomAzalioPin: any;
  azalioPinLength: number;
  isAzalioPlay: boolean;
  pinPattern: RegExp;
  isSMSCheckbox: boolean;
  showSMSCheckbox: any;

  // hideAuto: boolean;

  constructor(
    private ref: NbDialogRef<AddUserComponent>,
    private dataService: DataSharedService,
    private gs: GeneralService,
    private fb: FormBuilder,
    private service: UserService,
    private analytics: FirestoreService,
  ) {
    this.dataService
      .getConfigurations(false)
      .then((config) => {
        this.isCustomAzalioPin = config.company?.azalio_pin_auto_generate == 0 ? true : false;
        this.azalioPinLength = config.company?.azalio_pin_length;
        this.isAzalioPlay = config.company?.is_azalio_play == 1 ? true : false;
        this.nameConfig = config.company?.custom_names;
        this.isTeam = config.company?.is_team === 1 ? true : false;
        this.isPartner = config.is_partner;
        this.isSMSCheckbox = config.company?.is_sms_checkbox  === 1 ? true : false;
        if (config.role.role_id === 2 || config.role.role_title.includes('Account Owner')) {
          this.isAccountOwner = true;
        }
        this.placeholder = 'Search and assign ' + this.nameConfig?.region.toLowerCase();
        // this.placeholder = this.isTeam ? placeholder + '/' + this.nameConfig?.team : placeholder;
      })
      .finally(() => { 

        switch (this.azalioPinLength) {
          case 3:
            this.pinPattern = new RegExp (/^\d{3,3}$/);
          return;
          case 4:
            this.pinPattern = new RegExp (/^\d{4,4}$/);
          return;
          case 5:
            this.pinPattern = new RegExp (/^\d{5,5}$/);
          default:
            return '';
         }
      });
  }

  static isValidPin(control: AbstractControl) {
    if (!(control.value) || control.value === '****') {
      return null;
    }
    return String(control.value)
      .match(/^\d{4,4}$/) ? null : { 'isValidPin': true };
  }


  ngOnInit(): void {
    this.commonStoreCount = 0;
    this.defaultAssignment = [];
    this.isAllChecked = false;
    this.pinInputType = 'text';
    this.opacity = avatarOpacity;
    this.AddUserFormValues();
    this.onAddUser('adduser');
    this.isCreateAnother = this.openAddView;
    this.isEditingAccountOwner = this.userDetails?.is_account_owner ? true : false
    if (this.userDetails) {
      this.setCommonCount();
      const index = this.userDetails.assignments?.findIndex(row => row.id === null);
      this.isAllChecked = index > -1 ? true : false;
      this.rolesLoading = true;
      this.roleId = this.userDetails.role_id;
      this.pinInputType = 'password';
      if (this.userDetails.assignments.length == 0 && this.userDetails.regions.length !== 0) {
        this.userDetails.assignments = this.userDetails.regions.map(region => {
          return {
            id: region.region_id,
            name: region.region_title,
            type: 'Region',
            color: this.userDetails.user_color
          }
        })
      }

      this.showDelete = true;
      // this.userDetails.phone_number = '+92-333354545'  //dummy for testing
      let phoneNumber, code;
      if (this.userDetails.phone_number && this.userDetails.phone_number?.includes('-')) {
        phoneNumber = this.userDetails.phone_number.split('-');
        code = { code: phoneNumber[0] };
      }
      this.users.clear();
      this.users.push(
        this.fb.group({
          id: [this.userDetails.id],
          fullName: [this.userDetails.name, [Validators.required, Validators.maxLength(100)]],
          email: [this.userDetails.email, Validators.maxLength(100)],
          phone: [phoneNumber ? phoneNumber[1] : '', [Validators.minLength(7), Validators.maxLength(10)]],
          role: [this.userDetails.role_id, Validators.required],
          companyName: [''],
          azalioPin: [this.isCustomAzalioPin ? this.userDetails.play_pin : null],
          pin: ['****', AddUserComponent.isValidPin],
          countrycode: [code ? code : ''],
          externalId: [this.userDetails.external_id, [Validators.maxLength(145), Validators.pattern(/^[a-zA-Z0-9\.]*$/)]],
          sendSMS: []
        })
      );
      if (this.userDetails.is_account_owner) {
        setTimeout(() => {
          let user = this.users.controls[0] as FormGroup;
          user.controls.role.disable();
          user.controls.companyName.setValue(this.dataService.getCompanyName());
          user.controls.companyName.setValidators([Validators.required, Validators.maxLength(100)]);
          user.controls.companyName.updateValueAndValidity();
          if (!this.isAccountOwner) {
            user.controls.fullName.disable();
            user.controls.email.disable();
          }
        });
      }

      if (this?.userDetails?.is_account_owner) {
        this.userDetails['assignments'] = [{ name: 'All ' + this.nameConfig?.region_plural }]
      }
      const assignments = this.userDetails['assignments'] === null ? [] : this.userDetails['assignments'];
      this.AddUserForm.controls.regionTeams.setValue(assignments);
      this.user_id = this.userDetails.id;
      this.buttonLabel = 'Update';
    }
  }

  onTagSelectionChange($event) {
    const value = $event?.size > 0 ? Array.from($event) : '';
    this.regionId = value;
    this.AddUserForm.controls.regionTeams.setValue(value);
  }

  AddUserFormValues = () => {
    this.AddUserForm = this.fb.group({
      regionTeams: ['', Validators.required],
      usersArray: new FormArray([]),
    });
    let data = this.dataService.getSelectedFilter();
    this.defaultAssignment = this.regionId ? this.regionId : data ? [data] : this.regionId;  //For add user, set the default assignment as selected by the hierarchy filter
    this.AddUserForm.controls.regionTeams.setValue(this.defaultAssignment);
  };

  checkedChange(isChecked) {
    this.isAllChecked = isChecked;
    isChecked ? this.gs.logEvents('assign_user_to_all_stores') : '';
    isChecked ? this.updateValidators('regionTeams', []) : this.updateValidators('regionTeams', [Validators.required]);

    // if (isChecked) {
    //   this.isAllChecked = true;
    //   const existingAssignments = this.userDetails?.assignments ? this.userDetails.assignments : this.defaultAssignment;
    //   const allStoresItem = [{ id: null, name: 'All Stores', type: 'Region', color: null, role_title: null, is_partner: true }];
    //   if (this.userDetails) {
    //     this.userDetails.assignments = [...existingAssignments, ...allStoresItem];
    //     this.AddUserForm.controls.regionTeams.setValue(this.userDetails.assignments);
    //   } else {
    //     if (this.defaultAssignment === null || this.defaultAssignment === undefined) {
    //       this.defaultAssignment = [];
    //     }
    //     console.log(this.defaultAssignment);
    //     setTimeout(() => {
    //       this.defaultAssignment = [...existingAssignments, ...allStoresItem];
    //       this.AddUserForm.controls.regionTeams.setValue(this.defaultAssignment);
    //     });
    //   }
    // } else {
    //   this.isAllChecked = false;
    //   let array = this.userDetails ? [...this.userDetails.assignments] : [...this.defaultAssignment];
    //   if (array) {
    //     const index = array.findIndex(row => row.id === null);
    //     if (index > -1) {
    //       array.splice(index, 1);
    //       if (this.userDetails) {
    //         this.userDetails.assignments = array;
    //       } else {
    //         this.defaultAssignment = array;
    //       }
    //       this.AddUserForm.controls.regionTeams.setValue(array);
    //     }
    //   }
    // }
  }

  setRoles($event) {
    this.rolesLoading = false;
    this.roles = $event;
  }

  updateValidations = (data, index) => {
    if (!data) {
      return;
    }
    this.phoneRequired[index] = data.is_mobile;
    this.emailRequired[index] = data.is_web;
    this.azalioPinRequired[index] = this.isAzalioPlay && this.isCustomAzalioPin && data.is_azalio_play;

    let user = this.users.controls[index] as FormGroup;

    if (user.controls.sendSMS) {
      user.controls.sendSMS.setValue(data.sms_check_default_value);
      user.controls.sendSMS.updateValueAndValidity();
      this.showSMSCheckbox = this.isSMSCheckbox && data.is_mobile;
    }
    
    if (this.phoneRequired[index]) {
      user.controls.phone.setValidators([Validators.required, RxwebValidators.unique(), Validators.pattern(/^\d{7,10}$/)]);
      user.controls.phone.updateValueAndValidity();
      user.controls.countrycode.setValidators([Validators.required]);
      user.controls.countrycode.updateValueAndValidity();
      //&& (user.controls.pin.value == '****' || user.controls.pin.value == '')) 
      if (!this.userDetails) { //if user being added
        user.controls.pin.setValue(1234);
      } else {
        user.controls.pin.setValue('****');
      }
      user.controls.pin.enable();
    } else if (!this.phoneRequired[index]) {
      user.controls.phone.setValidators([RxwebValidators.unique(), Validators.pattern(/^\d{7,10}$/)]);
      user.controls.phone.updateValueAndValidity();
      user.controls.countrycode.setValidators([]);
      user.controls.countrycode.updateValueAndValidity();
      user.controls.pin.setValue('****');
      user.controls.pin.disable();
    }

    if (this.emailRequired[index]) {
      user.controls.email.setValidators([
        Validators.required,
        Validators.pattern(emailRegex),
        Validators.maxLength(100),
        RxwebValidators.unique(),
      ]);
      user.controls.email.updateValueAndValidity();
    } else if (!this.emailRequired[index]) {
      user.controls.email.setValidators([Validators.pattern(emailRegex), Validators.maxLength(100), RxwebValidators.unique()]);
      user.controls.email.updateValueAndValidity();
    }

    if (this.azalioPinRequired[index]) {
      user.controls.azalioPin.setValidators([
        Validators.required, Validators.pattern(this.pinPattern)]
      );
      user.controls.azalioPin.updateValueAndValidity();
    } else if (!this.azalioPinRequired[index]) {
      user.controls.azalioPin.setValidators([]);
      user.controls.azalioPin.updateValueAndValidity();
    }
  };

  updateValidators(key, value) {
    this.AddUserForm.controls[key].setValidators(value);
    this.AddUserForm.controls.regionTeams.updateValueAndValidity();
  }

  setSMSCheckbox(val) {
    let user = this.users.controls[0] as FormGroup;
    user.controls.sendSMS.setValue(val);
    user.controls.sendSMS.updateValueAndValidity();
  }

  submit = (ngForm) => {
    this.isAllChecked ? this.updateValidators('regionTeams', []) : this.updateValidators('regionTeams', [Validators.required]);
    console.log(ngForm);
    if (ngForm.valid) {
      this.loading = true;
      if (this.isAllChecked) {
        let onlyAllStoresArray = [{ id: null, name: 'All Stores', type: 'Region', is_partner: true }];
        this.AddUserForm.controls.regionTeams.setValue(onlyAllStoresArray);
      }
      if (this.userDetails) {
        this.editUser(ngForm);
      } else {
        this.addUser(ngForm);
      }
    }
  };

  addUser = async (ngForm) => {
    const usersList = this.users.controls.map((user) => {
      this.roleId = user.get('role').value.role_id;
      return {
        name: user.get('fullName').value,
        email: user.get('email').value,
        phone: user.get('phone').value ? user.get('countrycode').value.code + user.get('phone').value : '',
        role_id: user.get('role').value.role_id,
        pin: user.get('pin').value,
        play_pin: user.get('azalioPin').value,
        external_id: user.get('externalId').value,
        send_sms: this.showSMSCheckbox ? user.get('sendSMS').value : false
      };
    });
    const data = {
      users: usersList,
      assignments: this.AddUserForm.get('regionTeams').value,
    };

    try {
      const response: any = await this.service.addUsers(data);
      this.gs.showToastSuccess(response?.message);
      //this.close(true);
      if (this.isCreateAnother) {
        this.close({ refresh: false, createAnother: true, roleId: this.roleId, regionId: this.regionId });
        return;
      }
      this.close({ refresh: true, createAnother: false, roleId: null, regionId: null });
    } catch (error) {
      this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
    }
  };

  insertPin(user, obj) {
    let pin = user.get('pin').value;
    if (pin !== null && pin !== '' && pin !== '****') { //Insert pin if it was added by user
      Object.assign(obj, { pin: user.get('pin').value });
    }
    let playPin = user.get('azalioPin').value;
    if (this.isAzalioPlay && this.isCustomAzalioPin) {
      if (playPin !== null && playPin !== '' && playPin !== '****') { //Insert pin if it was added by user
        Object.assign(obj, { play_pin: user.get('azalioPin').value });
      }
    }
    return obj;
  }

  editUser = async (ngForm) => {
    const usersList = !this.userDetails?.is_account_owner ? this.users.controls.map((user) => {
      this.roleTitle = user.get('role').value.role_title;
      let obj = {
        id: user.get('id').value,
        name: user.get('fullName').value,
        email: user.get('email').value,
        phone: user.get('phone').value ? user.get('countrycode').value.code + user.get('phone').value : '',
        role_id: user.get('role').value.role_id,
        external_id: user.get('externalId').value,
        send_sms: this.showSMSCheckbox ? user.get('sendSMS').value : false

      };
      return this.insertPin(user, obj);
    }) : this.users.controls.map((user) => {
      let obj = {
        id: user.get('id').value,
        name: user.get('fullName').value,
        email: user.get('email').value,
        company_name: user.get('companyName').value,
        phone: user.get('phone').value ? user.get('countrycode').value.code + user.get('phone').value : '',
        external_id: user.get('externalId').value,
        send_sms: this.showSMSCheckbox ? user.get('sendSMS').value : false
      }
      return this.insertPin(user, obj);
    });

    const data = !this.userDetails?.is_account_owner ?
      { users: usersList, assignments: this.AddUserForm.get('regionTeams').value } :
      { users: usersList };

    try {
      const response: any = !this.userDetails?.is_account_owner ? await this.service.editUser(data) : await this.service.editAccountOwner(data);
      this.gs.showToastSuccess(response?.message);
      this.updateUserInfoInHeader(data);
      this.close({ refresh: true, createAnother: false, roleId: null, regionId: null });
    } catch (error) {
      this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
    }
  };

  updateUserInfoInHeader(data) {
    if (this.userDetails.is_account_owner && data.users[0].company_name) {
      this.dataService.setCompanyName(data.users[0].company_name);
    }
    if (this.dataService.getLoggedInUserId() === this.userDetails.id) {
      this.dataService.setUserName(data.users[0].name);
      this.dataService.setLoggedInUserEmail(data.users[0].email);
      this.dataService.setLoggedInUserRole(this.roleTitle);
    }
  }

  deleteUserFromStore() {
    if (this.editableStoreIds?.length > 0) {
      this.deleteUser(this.editableStoreIds);
    }
  }

  deleteUser = async (stores) => {
    // call api to delete existing Users
    const data = {
      user_id: this.user_id,
      store_id: stores
    };

    try {
      this.loading = true;
      const response: any = await this.service.deleteUsers(data);
      this.gs.showToastSuccess(response?.message);
      this.close({ refresh: true, createAnother: false, roleId: null, regionId: null });
    } catch (error) {
      this.gs.showToastError(error.message);
    } finally {
      this.loading = false;
    }
  };
  openNestedSideBar() {
    this.nestedClick.emit(this.userRegionData);
  }

  onSubmitClick(regionData) {
    document.getElementById('submit-add-user').click(); //Submit Add user form
  }

  onAddUser(anotheruser) {
    if (anotheruser === "anotheruser") {
      this.analytics.logEvents("add_another_user");
    }
    this.users.push(
      this.fb.group({
        id: [null],
        fullName: ['', [Validators.required, Validators.maxLength(100)]],
        email: ['', [Validators.pattern(emailRegex), Validators.maxLength(100), RxwebValidators.unique()]],
        phone: ['', [RxwebValidators.unique(), Validators.pattern(/^\d{7,10}$/)]],
        role: ['', Validators.required],
        pin: ['', [Validators.pattern(/^\d{4,4}$/)]],
        azalioPin: ['', [Validators.pattern(this.pinPattern)]],
        countrycode: [],
        externalId: ['', [Validators.pattern(/^[a-zA-Z0-9\.]*$/), Validators.maxLength(145)]],
        sendSMS: [false]
      })
    );

    this.phoneRequired.push(false);
    this.emailRequired.push(false);
    setTimeout(() => {
      const userForm = this.users.controls[this.users.length - 1] as FormGroup;
      userForm.controls.pin.setValue('****');
      userForm.controls.pin.disable();
      this.updateValidations(userForm.controls.role.value, this.users.length - 1);
    }, 10);
  }

  onRemoveUser(index) {
    this.phoneRequired.splice(index, 1);
    this.emailRequired.splice(index, 1);
    this.users.removeAt(index);
  }

  get form() {
    return this.AddUserForm.controls;
  }
  get users() {
    return this.form.usersArray as FormArray;
  }

  // close(refresh = false) {
  //   this.ref.close(refresh);
  // }
  close(data = { refresh: false, createAnother: false, roleId: null, regionId: null }) {
    this.ref.close(data);
    // if (data.createAnother) {
    //   this.ref.close(data);
    // } else {
    //   console.log('else');
    //   this.ref.close(data.refresh);
    // }
  }

  levelAnalytics() {
    this.analytics.logEvents("level_tooltip");
  }
  phoneAnalytics() {
    this.analytics.logEvents("phone_pin_tooltip");
  }
  updateCreateAnother($event) {
    //this.analytics.logEvents("create_another_level2");
    this.isCreateAnother = $event;
  }

  onPinFocus(user) {
    if (this.userDetails) {
      if (user.controls.pin.value === '****') {
        this.pinInputType = 'text';
        user.controls.pin.setValue(' ');  //to block autocomplete
        setTimeout(() => {
          user.controls.pin.setValue('');
        });
      }
    }

  }

  onPinFocusOut(user) {
    if (this.userDetails) {
      if (user.controls.pin.value === '') {
        user.controls.pin.setValue('****');
        this.pinInputType = 'password';
      }
    }

  }

  isShowCheckbox() {
    return (this.isAccountOwner || this.isPartner) && !this.isEditingAccountOwner;
  }

  isSelf() {
    return this.userDetails.id === this.dataService.getLoggedInUserId();
  }

  isShowDelete() {
    if (this.showDelete === true && !this.isSelf()) {
      return !this.userDetails?.is_account_owner && (this.isAccountOwner || this.isPartner);
    }
  }

  isShowRemove() {
    if (this.showDelete === true && !this.isSelf()) {
      return !this.userDetails?.is_account_owner 
      && !this.userDetails?.is_partner && !this.isAccountOwner && !this.isPartner;
    }
  }

  isShowDisclaimer() {
    if (this.showDelete === true) {
      return ((this.userDetails?.is_partner) && !this.isAccountOwner && !this.isPartner)
    }
  }

  setCommonCount() {
    if (this.isAccountOwner || this.isPartner) {
      this.disableStoreIds = [];
      this.editableStoreIds = null //all stores are removable
    } else {
      let ownAssignments = this.dataService.getLoggedInUserStores();
      const differentStores = this.userDetails.assignments.filter(o1 => !ownAssignments.some(o2 => o1.id === o2.region_id));
      const commonStores = this.userDetails.assignments.filter(o1 => ownAssignments.some(o2 => o1.id === o2.region_id));
      this.disableStoreIds = differentStores.map(x => { return x.id });
      this.editableStoreIds = commonStores.map(x => { return x.id });
      this.commonStoreCount = commonStores.length;
    }

  }
}
