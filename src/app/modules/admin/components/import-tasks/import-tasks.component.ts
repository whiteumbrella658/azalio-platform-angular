import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';
import { ViewErrorsComponent } from 'src/app/modules/users/components/view-errors/view-errors.component';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-import-tasks',
  templateUrl: './import-tasks.component.html',
  styleUrls: ['./import-tasks.component.scss']
})
export class ImportTasksComponent implements OnInit {
  @ViewChild('ngForm') ngForm: NgForm;
  @ViewChild('fileUpload', {static: false}) fileUpload: ElementRef;
  UploadFileForm: FormGroup;
  fileData: File = null; 
  loading: Boolean = false; 
  fileName: String;
  @Input() companyId;
  @Output() formSuccess: EventEmitter<null> = new EventEmitter<null>();

  constructor(
    private ref: NbDialogRef<ImportTasksComponent>, 
    private fb: FormBuilder,
    private dialogService: NbDialogService, 
    private service: AdminService, 
    private gs: GeneralService) { }

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
        return result;
      }
    }

    return null;
  }

  resetForm = () => {
    this.UploadFileForm.reset(this.UploadFileForm);
    this.fileData = null;
    this.ngForm.resetForm();
    this.fileUpload.nativeElement.value = null;
  }

  submit = async (ngForm) => {
    if(ngForm.valid) {
      this.loading = true;
      const formData: FormData = new FormData();
      formData.append('tasks', this.fileData, this.fileData.name);
      formData.append('parameters', JSON.stringify({company_id: this.companyId}))
      try {
        const response: any = await this.service.importTasks(formData);
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
    // viewTemp: ViewTemplateComponent,
    viewErrors: ViewErrorsComponent
  }

  open(keyName, data = null) {
    this.dialogService.open(this.temp[keyName],{hasBackdrop: true, closeOnBackdropClick: false, context: {data: data}
    }).onClose.subscribe(refresh => {
      this.resetForm();
    });
  }

  close(refresh = false) {
    this.ref.close(refresh);
  }

}
