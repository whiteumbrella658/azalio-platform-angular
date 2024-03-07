import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges,Renderer2  } from '@angular/core';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { trigger, state, style, transition, animate, group } from '@angular/animations';
import { noneOf } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  animations: [
    trigger('changeDivSize', [
      state('initial',
       style({
        width: '*',
        position: 'relative',
        right: '0px',
        top:'0px'
      })
      ),
      state('final', style({
        width: '200px',
        height: '32px',
        position: 'relative',
        top:'0px',
        right: '0px'
      })),
      transition('initial=>final', animate('0ms ease-in') ), //, style({ transform:  'translateX(500px)'})]
      transition('final=>initial', animate('0ms ease-in'))
    ]),
  ]
})
export class SearchInputComponent implements OnInit, OnChanges {
  @Input() placeholder: string;
  @Input() showHelperButton: boolean;
  @Input() storeApp: boolean;
  @Input() isAnimated:boolean;
  @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchAll: EventEmitter<string> = new EventEmitter<string>();
  searchText: string;
  searchedOn: boolean;
  // nameConfig: any;
  currentState = 'initial';
  constructor(private dataService: DataSharedService, private renderer: Renderer2) {
    this.placeholder = this.placeholder ? this.placeholder : '';
    this.isAnimated=this.isAnimated==false?this.isAnimated:true;
  }
  
  changeState() {
    this.currentState = 'final'; // this.currentState === 'initial' ? 'final' : 'initial';
  }
  ngOnInit(): void {
    if(this.storeApp != true){
    // this.dataService
    //   .getConfigurations(false)
    //   .then((config) => {
    //     console.log('')
    //     this.nameConfig = config.company?.custom_names;
    //   })
    //   .finally(() => {});
    }
    this.searchText = '';
    this.showHelperButton = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.showHelperButton && changes.showHelperButton.currentValue !== changes.showHelperButton.previousValue) {
      this.showHelperButton = changes.showHelperButton.currentValue;
    }
    
  }

  search(searchAll) {
    this.searchedOn = true;
    if (searchAll) {
      this.searchAll.emit(this.searchText);
      this.showHelperButton = false;
    } else {
      this.searchEvent.emit(this.searchText);
    }
    if (this.searchText === '') {
      this.searchedOn = false;
    }
  }
  onFocusOut(){
    if (!this.searchedOn){
      this.currentState = 'initial';
    }
  }
  onChange(value) {
    if (value === '') {
      if(!this.isAnimated){
      this.clear();
      }
    }
  }

  clear() {
    this.searchText = '';
    this.searchEvent.emit(this.searchText);
    this.searchedOn = false;
    this.currentState = 'initial';
  }
}
