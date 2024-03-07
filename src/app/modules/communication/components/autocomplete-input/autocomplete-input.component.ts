import {
  Component,
  OnInit,
  ViewChild,
  forwardRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { NbTagComponent, NbTagInputAddEvent } from '@nebular/theme';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
  debounceTime,
  map,
  distinctUntilChanged,
  switchMap,
  startWith,
  filter
} from 'rxjs/operators';
import { ApiService } from 'src/app/core/http/api.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UserService } from 'src/app/modules/users/user.service';
import { avatarOpacity } from 'src/constants';
import { GeneralService } from 'src/app/core/services/general.service';

const filterDataKeys = {
  Region: 'region_id',
  Team: 'team_id',
  Job: 'job_id',
};

export interface IUser {
  id: number;
  name: string;
  type: string;
  color: string;
}

@Component({
  selector: 'app-autocomplete-input',
  templateUrl: './autocomplete-input.component.html',
  styleUrls: ['./autocomplete-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteInputComponent),
    },
  ],
})
export class AutocompleteInputComponent
  implements OnInit, ControlValueAccessor
{
  users: any[] = [];
  textChanged: BehaviorSubject<string> = new BehaviorSubject<string>('');
  @ViewChild('autoInput') input;
  trees: Set<any> = new Set([]);

  @Output() userSelected: EventEmitter<Set<any>> = new EventEmitter();
  @Output() noRecords:EventEmitter<boolean>=new EventEmitter();
  options: IUser[] = [];
  filteredOptions$: Observable<any>;

  onChange: any = () => {};
  onTouched: any = () => {};
  loading: boolean;
  opacity: string;

  constructor(
    private gs: GeneralService,
    private http: ApiService,
    private userService: UserService,
    private storageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    this.opacity = avatarOpacity.toString();
    this.textChanged
      .pipe(
       debounceTime(200),
       distinctUntilChanged(),
        switchMap((text: string) => {
          if (!text.trim()) {
            return of([]);
          }
          return this.http.post(`organisation/searchQueryChat`, {
            search_text: text,
          });
        })
      )
      .subscribe((items) => {
        if(items.length<1 && this.textChanged.value.trim() !== ''){
          this.noRecords.emit(true);
        }else{
          this.noRecords.emit(false);
        }
        this.loading = false;
        this.options = items.filter(
          (item) => ![...this.trees].some((user) => user.id === item.id)
        );
        
        const res = this.options.filter(x=> x.type === 'User')

        this.filteredOptions$ =
          this.options.length > 0
            ? of(this.options)
            : this.textChanged.value.trim() === ''
            ? of([])
            : of([-1]);

            setTimeout(() => {
              const classItem = document.getElementsByClassName('nb-tag-input');
              if (classItem && classItem[0]) {
                (classItem[0] as HTMLElement).click();
              }
            });

      });

  }

  onTagRemove(tagToRemove: NbTagComponent): void {
    // this.trees.delete(tagToRemove.text);
    const selectedTag = [...this.trees].find(
      (item) => item.name === tagToRemove.text
    );
    this.trees = new Set<any>(
      [...this.trees].filter((item) => item.name !== tagToRemove.text)
    );
    // regions
    if (selectedTag) {
      this.options.push(selectedTag);
      this.filteredOptions$ = of(this.options);
      if (selectedTag.type === 'User') {
        this.users = this.users.filter((user) => user.id !== selectedTag.id);
        this.userSelected.emit(new Set(this.users));
      } else{
      const allselection = [...this.trees];
      let regions = allselection.filter(item => item.type === 'Region').map<number>(item => item.id);
      let teams = allselection.filter(item => item.type === 'Team').map<number>(item => item.id);
      let jobs = allselection.filter(item => item.type === 'Job').map<number>(item => item.id); 
      this.getUserData(regions, teams, jobs);
 
    }
    }
  }

  onTagAdd(item: NbTagInputAddEvent): void {
    const { input, value } = item;
    const filterData = this.filter2(value);

   // value && filterData?.length > 0  && this.trees.add(filterData[0]);
    if (value && filterData?.length > 0) {
      this.trees.add(filterData[0]);
    }

    this.options = this.options.filter(item => [...this.trees].some((tr) => item.id !== tr.id) );
    this.textChanged.next('');
    if (input) {
      input.nativeElement.value = '';
    }
  }

  // private filter(value: any): IUser[] {
  //   const filterValue = (value.name ? value.name : value).toLowerCase();
  //   return this.options.filter((optionValue) =>
  //     optionValue.name.toLowerCase().includes(filterValue)
  //   );
  // }

  private filter2(value: string): IUser[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(
      (optionValue) => optionValue.name.toLowerCase() === filterValue
    );
  }

  get usersNames(): string {
    let unique_users: any[] = [];
    this.users.forEach(user => {
      if (!unique_users.some(u => +u?.id === +user.id)) unique_users.push(user)
    })
    this.users = unique_users
    return this.users
      .slice(0, 6)
      .map((item) => item.name)
      .join(', ');
  }

  onAutocompleteChange(): void {
    this.loading = true;
    this.textChanged.next(this.input.nativeElement.value);
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
    this.options = this.options.filter(
      (item) => ![...this.trees].some((tr) => item.id === tr.id)
    );
    const allselection = [...this.trees];
    const regions = allselection.filter(item => item.type === 'Region').map<number>(item => item.id);
    const teams = allselection.filter(item => item.type === 'Team').map<number>(item => item.id);
    const jobs = allselection.filter(item => item.type === 'Job').map<number>(item => item.id);
    this.filteredOptions$ = of([]);
    this.input.nativeElement.value = '';
    this.textChanged.next('');
    if ($event.type.localeCompare('Team')==0 || $event.type.localeCompare('Region')==0 ||$event.type.localeCompare('Job')==0 ) {
      this.getUserData(regions, teams, jobs);
    } else if($event.type.localeCompare("User")==0) {
      if (!this.users.some((user) => user.id === $event.id)) {
        this.users.push($event);
      }
      this.userSelected.emit(new Set(this.users));
    }
  }

  async getUserData(regions: number[], teams: number[], jobs: number[]): Promise<void> {
    const data = await this.userService.postGetUsers(
      regions, jobs, teams
    );
    const selectedUsers = [...this.trees].filter(item => item.type === 'User');
    this.users = selectedUsers.length ? data.users :
    data.users.filter(item => !selectedUsers.some(user => user.id === item.id));
    if(regions.length>0 || teams.length>0 || jobs.length>0 ){
    this.users =[...selectedUsers, ...this.users];
    }
    else{
      this.users =[...selectedUsers];
    }
    this.userSelected.emit(new Set(this.users));
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(value: any): void {
    this.trees = value;
  }

  setDisabledState?(isDisabled: boolean): void {
    throw new Error('Method not implemented.');
  }
}
