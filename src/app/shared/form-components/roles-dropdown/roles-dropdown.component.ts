import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges,OnChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/core/http/api.service';
import { apiUrl } from 'src/api-url';


@Component({
  selector: 'app-roles-dropdown',
  templateUrl: './roles-dropdown.component.html',
  styleUrls: ['./roles-dropdown.component.scss']
})
export class RolesDropdownComponent implements OnInit,OnChanges {
  @Input() form: FormGroup;
  @Input() controlName: FormControl;
  @Input() placeholder: String;
  @Input() roleId: Number;
  @Input() roleData;
  roles: any;
  @Output() roleChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() gettingRoles: EventEmitter<any> = new EventEmitter<any>();


  constructor(private http: ApiService) { }

  ngOnInit(): void {

    if (this.roleData) {
      this.roles = this.roleData;
      this.initRoleData();
    } else {
      this.getRoles();
    }

  }
  

  ngOnChanges(changes: SimpleChanges) {
    if (this.roles && changes.roleId && changes.roleId.currentValue) {
      const role = this.roles.find(role => changes.roleId.currentValue === role.role_id)
      this.form.controls.role.setValue(role);
    }
  }

  getRoles() {
    const url = apiUrl.user.get.getAllRoles;
    this.http.get(url).subscribe((res: any) => {
      this.roles = res.roles;
      this.gettingRoles.emit(res.roles);
      this.initRoleData();
    }, error => {
      console.log(error);
    });
  }

  initRoleData() {
    if (this.roles.length === 1) {
      this.form.controls.role.setValue(this.roles[0]);
    }
    if (this.roleId == 2) {
      const accountOwnerRole = {
        role_id: 2, role_title: "Account Owner",  is_mobile: true, is_web: true, // role_description: "", feature_title: ""
      }
      this.roles.push(accountOwnerRole)
    }
    const role = this.roles.find(role => this.roleId === role.role_id)
    this.form.controls.role.setValue(role);
    this.roleChange.emit(role);
  }

  change(event) {
    this.roleChange.emit(event);
  }
}
