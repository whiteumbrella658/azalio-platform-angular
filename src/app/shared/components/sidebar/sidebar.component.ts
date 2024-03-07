import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  providers: [NbSidebarService]
})
export class SidebarComponent implements OnChanges, OnInit {
  sidebarOpened: boolean;
  @Input() showSideBar;
  @Input() tag;
  @Input() header:boolean;
  @Output() closeDetails: EventEmitter<null> = new EventEmitter<null>();
  start: boolean =false;
showLeftSidebar:boolean;


  constructor(private sidebarService: NbSidebarService) {
   }
ngOnInit(){
  this.showLeftSidebar=false;
}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['showSideBar'] && changes.showSideBar.currentValue !== changes.showSideBar.previousValue) {
      this.toggle();
    }
    if(changes['header'] && changes.header.currentValue !== changes.header.previousValue ){
      this.showLeftSidebar=true;
    }
  }

  toggleSidebar() {
    this.sidebarOpened = !this.sidebarOpened;
  }

  toggle() {
    this.sidebarService.toggle(false, this.tag);
  }

  closeSideBar() {
    this.closeDetails.emit();
  }

}
