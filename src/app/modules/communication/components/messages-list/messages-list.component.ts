import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { avatarOpacity } from 'src/constants';
import {
  ChatListWithUser,
  FirestoreService,
} from '../../../../core/services/firestore.service';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/core/services/general.service';
import { Subscription } from 'rxjs';
import { NewMessageComponent } from '../../components/new-message/new-message.component';
import { ChatListComponent } from '../../components/chat-list/chat-list.component';
import { NbDialogService  } from '@nebular/theme';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss'],
})
export class MessagesListComponent implements OnInit { //implements OnChanges
  @Input() currentChat: ChatListWithUser;
  @Input() isHideActive: Boolean;
  @Input() preselect: Boolean;
  @Input() userId: any

  @Input() userChatList: ChatListWithUser[];
  @Output() currentChatSelected: EventEmitter<ChatListWithUser> =
    new EventEmitter<ChatListWithUser>();
  @Output() totalChats: EventEmitter<number> =
    new EventEmitter<number>();
  
  @Output() isChatNotification:EventEmitter<boolean>=new EventEmitter<boolean>();
  search = '';
  opacity: string;
  is_chat_notification:boolean;
  newMessage: boolean;
  subscription: Subscription[] = [];
  countChatList:number;
  hideActive: boolean;
  constructor(
		private dataService: DataSharedService,
		private gs: GeneralService,
		private firestoreService: FirestoreService,
		private router: Router,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.userId = null;
    this.hideActive = false;
    this.currentChat = null;
    this.opacity = avatarOpacity.toString();
    this.getUsers();
    this.countChatList=0;
  }



  ngOnChanges(changes: SimpleChanges) {
    if (changes.preselect && !changes.preselect.firstChange && changes.preselect.currentValue !== changes.preselect.previousValue) {
      if (changes && changes.userId) {
        if (this.findUser(changes.userId.currentValue) === false) {
          console.log('RETRY');
          setTimeout(() => { //retry after 200ms
            this.findUser(changes.userId.currentValue);
          }, 1000);
        }

      }
		}

    if (changes.isHideActive && changes.isHideActive.currentValue !== changes.isHideActive.previousValue) {
      this.hideActive = changes.isHideActive.currentValue;
		}
	}

  findUser(userId) {
    const selectedUser = this.userChatList.find(user=> user.userId == userId);
    if (selectedUser !== undefined) {
      console.log('user found');
      this.onCurrentChatSelected(selectedUser); //preselecting user row after new message is sent.
      return true;
    }
    console.log('user NOT found');
    return false;
  }
  
getUsers(){
  this.dataService
			.getConfigurations(false)
			.then((config) => {
        this.is_chat_notification = config.company.is_chat_notification ;
        this.isChatNotification.emit(this.is_chat_notification);
				if (config.company.is_communication !== 1) {
					this.router.navigate(['401']);
				}
			})
			.finally(() => {
				this.gs.hideSplashScreen();
				this.newMessage = false;
				const subscription = this.firestoreService.getUsersChatList().subscribe((chatUsers) => {
					this.userChatList = chatUsers;
          this.countChatList=this.userChatList.length;
          this.totalChats.emit(this.userChatList.length)
					if (!this.currentChat && chatUsers.length) {
						// this.currentChat = chatUsers[0];
					}
				});
				this.subscription.push(subscription);
			});
}
  onCurrentChatSelected(currentChatUser: ChatListWithUser): void {
    this.firestoreService.updateMessageRead(currentChatUser.chatId).then();
    this.currentChatSelected.emit(currentChatUser);
    this.newMessage = false;
		this.currentChat = currentChatUser;

  }
  onUserSearch(search: string): void {
    this.gs.logEvents('search_user_from_message_list');
    
    this.search = search;
    if(search ==""){
      this.getUsers();
    }
  }
  newMessagePopup(){
    this.dialogService.open(NewMessageComponent, { hasBackdrop: true, closeOnBackdropClick: false }); //.onClose.subscribe((refresh) => {});
  }
  ngOnDestroy() {
		this.subscription?.forEach(x=>{
      x?.unsubscribe();
    })
	  }
}
