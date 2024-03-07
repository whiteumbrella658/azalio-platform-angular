import {
  Component,
  OnInit,
  ViewChild,
  forwardRef,
  Output,
  EventEmitter,
  Input,
  SimpleChanges,
  OnChanges
} from '@angular/core';
import { NbTagComponent, NbTagInputAddEvent } from '@nebular/theme';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
  startWith,
  switchMap
} from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api.service';
import { avatarOpacity } from 'src/constants';
import { GeneralService } from 'src/app/core/services/general.service';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
export interface IUser {
  id: number;
  name: string;
  color: string;
  role_title:string;
  type:string;
}
@Component({
  selector: 'app-user-autocomplete-input',
  templateUrl: './user-autocomplete-input.component.html',
  styleUrls: ['./user-autocomplete-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserAutocompleteInputComponent),
    },
  ],
})

export class UserAutocompleteInputComponent implements OnInit,ControlValueAccessor, OnChanges {

  filteredControlOptions$: Observable<any[]>;
  textChanged: BehaviorSubject<string> = new BehaviorSubject<string>('');
 // inputFormControl: FormControl;
  value: string;
  options: IUser[] = [];
  dataSource:any;
  loading:boolean;
  opacity:string;
  tagText: string;
  user:IUser;
  disable:boolean;
  onChange: any = () => {};
  onTouched: any = () => {};
  @ViewChild('autoInput', {static: true}) input;
  @Input() disableInput: boolean;
  @Input() autofocus: boolean;
  @Input() region: number;
  @Input() url: string;
  @Input() data: any;
  @Input() className: string;
  @Input() loaderClass: string = '';
  @Input() isOwnAddEdit: boolean;
  @Output() selectedUser: EventEmitter<any> = new EventEmitter<any>();
constructor(      private gs: GeneralService,
  private dataService: DataSharedService,
  private http: ApiService){}
  ngOnInit() {
    this.autofocus = this.autofocus ? this.autofocus : false;
    this.disable=false;
    this.tagText='';
    this.opacity = avatarOpacity.toString();
    this.textChanged
    .pipe(
      startWith(''),
      switchMap((text: string) => {
        if (!text.trim() || (this.region == null && this.url == null)) {
          return of([]);
        }
        console.log(this.url);
        if (this.url) {
          return this.http.get(this.url + '&search=' + text);
        } else {
          return this.http.get(`organisation/getUsersByRegionTeamIds?region_id=`+this.region+'&search='+text);
        }
      })

    )
    .subscribe((items) => {
      if (!this.isOwnAddEdit) {
        const filteredItems = items.filter(item => item.id !== this.dataService.getLoggedInUserId());
        items = [...filteredItems];
      }
      this.loading = false;
      this.options = items;
        const classItem = document.getElementsByClassName('nb-tag-input');
        setTimeout(() => {
          if (classItem && classItem[0]) {
            (classItem[0] as HTMLElement).click();
          }
        });
       this.filteredControlOptions$= items.length > 0
       ? of(this.options)
       : this.textChanged.value.trim() === ''
      ? of([])
      : of([-1]);
    });
    console.log(this.data);

    if (this.data && (this.data[0]?.id || this.data[0]?.name)) {
      this.tagText = this.data[0]?.name;
      // this.filteredControlOptions$ = this.data;
    }
  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes.region && changes.region.currentValue !== changes.region.previousValue) {
      this.tagText='';
      this.input.nativeElement.value = '';
    this.region=changes.region.currentValue;
    this.filteredControlOptions$ = of([]);
    this.disable=false;
    }
    if (changes.data) {
      this.tagText = changes.data.currentValue;
      this.input.nativeElement.value = '';
      this.filteredControlOptions$ = of([]);
      this.disable=false;
    }
    if (changes.disable) {
      this.disableInput = changes.disableInput.currentValue;
    }
  }
  onSelectionChange($event): void {
    if ($event === -1) {
      this.input.nativeElement.value = '';
      this.textChanged.next('');
      return;
    }
    
    this.tagText=$event?.name;
    this.options = this.options.filter((item)=>item.id==$event?.id);
    this.filteredControlOptions$ = of([]);
    this.input.nativeElement.value = '';
    this.input.nativeElement.blur();
    this.disable=(this.tagText)?true:false;
    this.textChanged.next('');
    this.selectedUser.emit($event)
  }

  onTagRemove(tagToRemove: NbTagComponent): void {
    this.tagText='';
    this.disable=false;
    this.selectedUser.emit(null)
  }
  onAutocompleteChange(): void {
    this.loading = true;
    this.textChanged.next(this.input.nativeElement.value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.tagText = value;
  }
}