import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { ViewTemplateComponent } from '../view-template/view-template.component';
import { ViewErrorsComponent } from '../view-errors/view-errors.component';
import {FirestoreService} from 'src/app/core/services/firestore.service';

@Component({
  selector: 'app-import-users',
  templateUrl: './import-users.component.html',
  styleUrls: ['./import-users.component.scss']
})
export class ImportUsersComponent implements OnInit {
  @ViewChild('ngForm') ngForm: NgForm;
  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef;
  UploadFileForm: FormGroup;
  fileData: File = null; 
  loading: Boolean = false; 
  fileName: String;
  @Output() formSuccess: EventEmitter<null> = new EventEmitter<null>();

  constructor(private ref: NbDialogRef<ImportUsersComponent>, private fb: FormBuilder,private dialogService: NbDialogService, private service: UserService, private gs: GeneralService,private analytics: FirestoreService) { }

  ngOnInit(): void {
    this.addFormValues();
  }

  addFormValues = () => {
    this.UploadFileForm = this.fb.group({
      file: ['', Validators.required]
    }
    ,{
      validator: [
        this.fileValidator,
      ]
    } as AbstractControlOptions
    );
  }

  fileValidator: ValidatorFn = (group: FormGroup): ValidationErrors | null => { 
    let result = {};
    let invalidFileType;
    this.fileName = group.controls.file.value;
    if (this.fileName) {
      const fileExtension = (group.controls.file.value.split('.'));
      if (fileExtension[fileExtension.length-1] !== "xlsx") {
        invalidFileType = true;
        result = {
          invalidFileType
        }
      }
    }

    return result === {} ? null : result;
  }

  resetForm = () => {
    this.UploadFileForm.reset(this.UploadFileForm);
    this.fileData = null;
    this.ngForm.resetForm();
    this.fileUpload.nativeElement.value = null;
  }

  submit = async (ngForm) => {
    // console.log(ngForm);
    this.analytics.logEvents("upload_users_data");
    if(ngForm.valid) {
      this.loading = true;
      const formData: FormData = new FormData();
      formData.append('users', this.fileData, this.fileData.name);
      try {
        const response: any = await this.service.importUsers(formData);
        this.gs.showToastSuccess(response?.message);
        this.close(true);
      } catch (error) {
        this.gs.showToastError(error.message);
        if (error.message === "Errors in file uploaded!") {
          this.open('viewErrors', error)
        }
      } finally {
        this.loading = false;
      }
    }
  }

  handleFileInput = (event: any) => {
    this.fileData = event.target.files[0];
    this.UploadFileForm.controls.file.setValue(this.fileData.name);
  }
  
  clickSelectFile = () => {
    this.fileUpload.nativeElement.click();
  }

  temp: any = {
    viewTemp: ViewTemplateComponent,
    viewErrors: ViewErrorsComponent
  }

  open(keyName, data = null) {
    this.analytics.logEvents("users_template");
    this.dialogService.open(this.temp[keyName],{hasBackdrop: true, closeOnBackdropClick: false, context: {data: data}
    }).onClose.subscribe(refresh => {
      this.resetForm();
    });
  }

  close(refresh = false) {
    this.ref.close(refresh);
  }
}
