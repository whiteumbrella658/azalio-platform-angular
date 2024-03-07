import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { apiUrl } from 'src/api-url';
import { ApiService } from 'src/app/core/http/api.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { GeneralService } from 'src/app/core/services/general.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { avatarOpacity } from 'src/constants';
import { AskGptService } from '../../ask-gpt.service';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {
  @Output() onNewChat: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChat: EventEmitter<Number> = new EventEmitter<Number>();

  selectedRoute = 'home';
  icons = [
    { key: 'home', title: 'AskQ Home', icon: 'fa-light fa-house action-btns grow', route: 'askq' },
    { key: 'charts', title: 'Saved Charts', icon: 'fa-regular fa-chart-pie-simple action-btns grow', route: 'askq/mycharts' },
    { key: 'comm', title: 'AI & Automations', icon: 'fa-light fa-comments action-btns grow', route: 'askq/communication' },
  ]

  // bottomIcons = [
  //   { key: null, title: 'Settings', icon: 'fa-solid fa-gear action-btns disable-btns', route: null }
  // ]
  conversations: any[] = [];
  loading: boolean;
  selectedConvo: any;
  profileInfo: any;
  opacity: number;
  displayPopup: any;
  filteredConvos: any;

  constructor(
    private authService: AuthService,
    public storageService: LocalStorageService,
    private http: ApiService,
    public dataService: DataSharedService,
    private service: AskGptService,
    private router: Router,
    private gs: GeneralService
    ) {
      this.opacity = avatarOpacity;
    }

  @Input() customClass;
  @Input() showConvo;

  @HostListener('document:click')
  public onClick(targetElement) {
    if (this.displayPopup) {
      this.displayPopup = false;
    }
  }


  ngOnInit(): void {
    this.customClass = this.customClass ? this.customClass : '';
    this.showConvo = this.showConvo ? this.showConvo : false;
    this.getProfileInfo();
    if (this.showConvo) {
      this.getConversationList();
    }
    this.initSelection();
  }

  hideShowPopup() {
    this.displayPopup = !this.displayPopup
  }

  navigateTo(route) {
    if (!route) {
      return;
    } 
    this.router.navigate([route]);
  }

  openNewChat() {
    this.selectedConvo = null;
    this.onNewChat.emit()
  }

  openChat(item) {
    if (item.id !== this.selectedConvo) {
      this.selectedConvo = item.id;
      this.onChat.emit(item.id)
    }
  }

  goToAdminView() {
    this.router.navigate(['admin']);
    this.dataService.setConfigurations(null);
    this.dataService.setSharingRegionData(null,null);
    this.dataService.setSingleRegionData(null, null);
  }

  updateConversationList(item) { //push to list whenever a new conversation is created and pre-select it.
    item['created_on'] = new Date().toISOString();
    this.conversations.unshift(item);
    if ('today' in this.filteredConvos) {
      this.filteredConvos.today.data.unshift(item);
    } else {
      Object.assign(this.filteredConvos, { today: { label: 'Today', data: [item] } });
    }

    const updatedObject = { ...this.filteredConvos, today: { ...this.filteredConvos.today, data: this.filteredConvos.today.data } };

    // Assign the updated object back to trigger change detection
    this.filteredConvos = updatedObject;
    this.selectedConvo = item.id;
  }

  updateSelection(id) {
    this.selectedConvo = id;
  }

  async getConversationList() {
    try {
      this.loading = true;
      const response: any = await this.service.getConversations();
      this.conversations = response.conversations;
      this.filteredConvos = this.gs.filterData(this.conversations);
    } catch (error) {
      this.gs.showToastError(error.message);
      console.log(error)
    } finally {
      this.loading = false;
    }
  }

  initSelection() {
    if (this.router.url.includes('askq/mycharts')) {
      this.selectedRoute = 'charts';
    } else if (this.router.url.includes('askq/communication')) {
        this.selectedRoute = 'comm';
    } else if (this.router.url.includes('askq')) {
      this.selectedRoute = 'home';
    } 
  }

  getProfileInfo() {
    const url = apiUrl.user.get.profileInfo;
    this.http.get(url).subscribe((res: any) => {
        this.profileInfo = res.user_info;
        this.dataService.setCompanyName(res.user_info.company_title);
        this.dataService.setLoggedInUserId(res.user_info.user_id);
        this.dataService.setUserName(res.user_info.name);
        this.dataService.setLoggedInUserEmail(res.user_info.email);
        this.dataService.setRoleId(res.user_info.role_id);
        this.dataService.setUserColor(res.user_info.color);
        this.dataService.setLoggedInUserRole(res.user_info.role_title);
      },(error) => {
        console.log(error);
      });
  }

  switchToAzalio() {
    this.router.navigate(['organization'])
  }


  async logout(): Promise<void> {
    await this.authService.signOut();
    this.router.navigate(['/home']);
    this.storageService.removeToken();
    this.dataService.setSharingRegionData(null,null);
    this.dataService.setSingleRegionData(null, null);
  }

}
