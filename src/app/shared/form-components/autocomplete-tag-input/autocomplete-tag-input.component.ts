import { Component, OnInit, ViewChild, forwardRef, Output, EventEmitter, Input, SimpleChanges,OnChanges } from '@angular/core';
import { NbTagComponent, NbTagInputAddEvent } from '@nebular/theme';
import { ControlValueAccessor, FormControlName, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ApiService } from '../../../core/http/api.service';
import { UserService } from '../../../modules/users/user.service';
import { LocalStorageService } from '../../../core/services/local-storage.service';
import { avatarOpacity } from 'src/constants';

const filterDataKeys = {
  Region: 'region_id',
  Team: 'team_id',
};

export interface IUser {
  id: number;
  name: string;
  type: string;
  color: string;
}

@Component({
  selector: 'app-autocomplete-tag-input',
  templateUrl: './autocomplete-tag-input.component.html',
  styleUrls: ['./autocomplete-tag-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteTagInputComponent),
    },
  ],
})
export class AutocompleteTagInputComponent implements OnInit, ControlValueAccessor,OnChanges {
  users: any[] = [];
  textChanged: BehaviorSubject<string> = new BehaviorSubject<string>('');
  @ViewChild('autoInput') input;
  trees: Set<any> = new Set([]);

  @Output() changeClick: EventEmitter<Set<any>> = new EventEmitter();
  @Input() data: any;
  @Input() disableTags: any;
  @Input() placeholder: any;
  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
  @Input() disabled: boolean = false;
  @Input() isSearchUsers: boolean = false;
  @Input() isSearchOnlyUsers: boolean = false;
  @Input() isSearchRole: boolean = false;
  @Input() classItem; 
  options: any;
  filteredOptions$: Observable<any>;
  showPlaceholder: boolean;
  loading: boolean;
  url: string;
  opacity: number;

  constructor(private http: ApiService, private userService: UserService, private storageService: LocalStorageService) {
    this.opacity = avatarOpacity;
    this.disableTags = this.disableTags;
    this.classItem = this.classItem;
  }
  writeValue(obj: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnChange(fn: any): void {
    throw new Error('Method not implemented.');
  }
  registerOnTouched(fn: any): void {
    throw new Error('Method not implemented.');
  }
  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.textChanged
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((text: string) => {
          if (!text.trim()) {
            return of([]);
          }
          this.url = 'organisation/searchQuery';
          if (this.isSearchUsers) {
            this.url = this.isSearchUsers ? 'organisation/searchQueryChat':'organisation/searchQuery';
          }
          return this.http.post(this.url, {
            search_text: text,
            onlyRegionsAndTeams: this.isSearchOnlyUsers ? false : true,
            onlyUsers: this.isSearchOnlyUsers ? true : false,
            isRole: this.isSearchRole ? true : false
          });
        })
      )
      .subscribe((items) => {
        this.loading = false;
        this.options = items?.filter((item) => ![...this.trees].some((user) => user.id === item.id));
        this.filteredOptions$ = this.options?.length > 0 ? of(this.options) : this.textChanged.value.trim() === '' ? of([]) : of([-1]);
        setTimeout(() => {
          const classItem = document.getElementsByClassName('nb-tag-input');
          let index = this.classItem ? this.classItem : 0;
          if (classItem && classItem[index]) {
            (classItem[index] as HTMLElement).click();
          }
        });
      });


    if (this.data && (this.data[0]?.id || this.data[0]?.name)) {
      this.trees = new Set(this.data);
    }else{
      this.changeClick.emit(null);
    }
    this.setPlaceholder(this.data);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data && (changes.data.currentValue !== changes.data.previousValue)) {
     if(this.data?.length>0){
      if(this.data && (this.data[0]?.id||this.data[0]?.name )){

      this.trees = new Set(changes.data.currentValue);
      this.setPlaceholder(changes.data.currentValue);
      }
    }else{
      this.data=null;
    }
    }
  }

  setPlaceholder(array) {
    this.showPlaceholder = array && array.length > 0 ? false : true;
  }

  onAutocompleteChange(): void {
    this.loading = true;
    this.textChanged.next(this.input.nativeElement.value);
  }

  onTagAdd(item: NbTagInputAddEvent): void {
    const { input, value } = item;
    const filterData = this.filter2(value);
    if (value && filterData?.length > 0) {
      this.trees.add(filterData[0]);
      this.changeClick.emit(new Set(this.trees));
    }
    if([...this.trees].length>0){this.showPlaceholder=false}
    if (input) {
      input.nativeElement.value = '';
    }
  }

  private filter2(value: string): IUser[] {
    const filterValue = value.toLowerCase();
    const result = this.options.filter((x) => {
      if (x.name?.toLowerCase() === filterValue) {
        return x;
      }
    });
    return result;
  }

  onTagRemove(tagToRemove: NbTagComponent): void {
    const selectedTag = [...this.trees].find((item) => item.name === tagToRemove.text);
    this.trees = new Set<any>([...this.trees].filter((item) => item.name !== tagToRemove.text));

    // regions
    if (selectedTag) {
      // this.options.push(selectedTag);
      this.filteredOptions$ = of(this.options);
      const allselection = [...this.trees];
      this.setPlaceholder(allselection);
      this.changeClick.emit(new Set(this.trees));
    }
  }

  onSelectionChange($event): void {
    if ($event === -1) {
      this.input.nativeElement.value = '';
      this.textChanged.next('');
      return;
    }
    if (![...this.trees].some((item) => item.id === $event.id)) {
      this.trees.add($event);
    }
    this.options = this.options.filter((item) => ![...this.trees].some((tr) => item.id === tr.id));
    const allselection = [...this.trees];
    // const regions = allselection.filter(item => item.type === 'Region').map<number>(item => item.id);
    // const teams = allselection.filter(item => item.type === 'Team').map<number>(item => item.id);
    // const jobs = allselection.filter(item => item.type === 'Job').map<number>(item => item.id);
    this.filteredOptions$ = of([]);
    this.input.nativeElement.value = '';
    this.textChanged.next('');
    // this.filteredOptions$ = this.getFilteredOptions($event);
    this.setPlaceholder([...this.trees]);
    this.changeClick.emit(new Set(this.trees));

    // if ($event.type !== 'User') {
    //   // this.getUserData(regions, teams, jobs);
    // } else {
    //   if (!this.users.some((user) => user.id === $event.id)) {
    //     this.users.push($event);
    //   }
    //   console.log('emit data?')
    //   this.onChange.emit(new Set(this.trees));
    // }
  }
}
