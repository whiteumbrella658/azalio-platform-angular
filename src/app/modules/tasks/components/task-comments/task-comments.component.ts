import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/core/services/general.service';
import { avatarOpacity, paginatorOptions } from 'src/constants';
import { TasksService } from '../../tasks.service';
import {FirestoreService} from 'src/app/core/services/firestore.service';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
@Component({
  selector: 'app-task-comments',
  templateUrl: './task-comments.component.html',
  styleUrls: ['./task-comments.component.scss']
})
export class TaskCommentsComponent implements OnInit, OnChanges {
  sum = 100;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = "";

  @Input() selectedTask: any;
  @Output() onCommentAdd: EventEmitter<any> =
  new EventEmitter<any>();


  form: FormGroup;
  loading: boolean;
  taskDetails: any;
  taskHistory: any;
  opacity: number;
  emptyResults: boolean;
  commentLoading: boolean;
  paginator: { page_no: number; page_size: number; total_records: number; };
  loadingNext: boolean;
  isAzalioPlay: boolean;
  focus: boolean;
  taskDescription: string;
  showDescription: boolean;
  isBoringPlay: boolean;

  constructor(  
    private dataService: DataSharedService,
    public gs: GeneralService,
    private fb: FormBuilder,
    private analytics: FirestoreService,
    public service: TasksService) {
    this.form = this.fb.group({
      comment: ['', [Validators.required]],
    });

    this.dataService.getConfigurations(false).then((config) => {
      this.isAzalioPlay = config.company?.is_azalio_play === 1 ? true : false;
      this.isBoringPlay = config.company?.boring2Fun === 1 ? true : false;
    }).finally(() => {
    });
      
   }

  ngOnInit(): void {
    this.opacity = avatarOpacity;
    this.paginator = paginatorOptions;
    this.paginator.page_size = 10;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedTask'] && changes.selectedTask.currentValue !== changes.selectedTask.previousValue) {
      this.taskDetails = changes.selectedTask.currentValue;
      if (this.taskDetails && this.taskDetails.id) {
        this.getData();
      }
    }
  }

  isValidPage() {
    const rowCount = this.paginator.page_size * this.paginator.page_no;
    return (rowCount <= this.paginator.total_records || ((rowCount - this.paginator.total_records) <= this.paginator.page_size && (rowCount - this.paginator.total_records) >= 1));
  }

  loadNext() {
    if (this.loadingNext) {
      return;
    }
    if (this.isValidPage()) {
      this.loadingNext = true;
      const paginationData = {
        pageIndex: this.paginator.page_no, 
        pageSize: this.paginator.page_size
      }
      this.service.getTaskHistory(this.taskDetails.id, paginationData)
      .then((response: any) => {
        this.taskHistory.unshift(...response.history.reverse());
        this.paginator.page_no = this.paginator.page_no + 1;
        const elem = document.getElementById('tasks-wrapper');
        setTimeout(() => {
          elem.scrollTop = 2;
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.loadingNext = false;
        this.loading = false;
      });
    }
  }

  getData() {
    this.analytics.logEvents("view_task_details");
    this.showDescription = false;
    this.loading = true;
    this.service.getTaskHistory(this.taskDetails.id)
      .then((response: any) => {
        this.taskDescription = response.description;
        this.taskHistory = response.history.reverse();
        this.emptyResults = response.history?.length === 0;
        this.paginator = response.pagination;
        setTimeout(() => {
          this.scrollToBottom(); 
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        this.loading = false;

      });
    }

  onfocus() {
    console.log('focus');
    this.focus = true;
  }

  onfocusout() {
    setTimeout(() => {
      if (!this.commentLoading) {
        this.focus = false;
      }
    }, 100);
    console.log('focus out');
  }

  async addComment() {
    if (this.commentLoading) {
      return;
    }
    this.analytics.logEvents("add_task_comment");
    if (this.form.valid) {
      this.commentLoading = true;
      const data = {
        "task_id":  this.selectedTask.id,
        "comment": this.form.controls.comment.value,
      }    

      try {
        const response: any = await this.service.addTaskComment(data);
        this.gs.showToastSuccess(response?.message);
        this.focus = false;
        this.form.controls.comment.setValue('');
        if (response?.history && response.history[0]) {
          this.taskHistory.push(response?.history[0]);
          this.emptyResults = this.taskHistory?.length === 0;
          this.onCommentAdd.emit();
          setTimeout(() => {
            this.scrollToBottom(); 
          });

        }
      } catch (error) {
        this.gs.showToastError(error.message);
        console.log(error)
      } finally {
        this.commentLoading = false;
      }
    }
  }

  scrollToBottom() {
    const elem = document.getElementById('tasks-wrapper');
    if (elem) {
      elem.scrollTop = elem.scrollHeight;
    }
  }

  onScrollDown() {
    // console.log('scroll down');
  }

  onScrollUp() {
    this.loadNext();
  }
  addImageAnalytics(){
    this.analytics.logEvents('preview_task_comment_photo');
  }
}
