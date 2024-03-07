import { Component, OnDestroy, OnInit, Input,ViewChild,TemplateRef,ElementRef } from '@angular/core';
import { NbDialogService , NbWindowControlButtonsConfig, NbWindowService,NbWindowState  } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';
import { NewMessageComponent } from '../../components/new-message/new-message.component';
import  {ChatListComponent } from '../../components/chat-list/chat-list.component';
import { ChatListWithUser, FirestoreService } from '../../../../core/services/firestore.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { avatarOpacity } from 'src/constants';

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrls: ['./chat-page.component.scss']
})
export class ChatPageComponent implements OnInit {
    currentChat: ChatListWithUser;
	userChatList: ChatListWithUser[] = [];
	subscription: Subscription[] = [];
    is_chat_notification:boolean; //for 1781
	newMessage: boolean;
	countChatList:number;
	 @ViewChild('contentTemplate') contentTemplate: TemplateRef<any>;
	 @ViewChild('newMessageTemplate') newMessageTemplate: TemplateRef<any>;
	@ViewChild('titleTemplate') titleTemplate: TemplateRef<any>;
	@ViewChild('curretntMessageTitleTemplate') curretntMessageTitleTemplate: TemplateRef<any>;
	@ViewChild('newMessageTitleTemplate') newMessageTitleTemplate: TemplateRef<any>;
	windowNewMessageRef: any;
	windowCurrentMessageRef: any;
	windowChatListRef: any;
	opacity: string;
	is_chat_popup: boolean;
	hideActive: boolean;
	togglePreselect: boolean;
	userId: any;
	

	constructor(
		private gs: GeneralService,
		private dialogService: NbDialogService,
		private router: Router,
        private windowService: NbWindowService
	) {}

	ngOnInit(): void {
		this.opacity = avatarOpacity.toString();
		this.is_chat_popup=true;
	}

	navigateToChats() {
		this.router.navigate(['/communication']);
		this.closeAllWindows();
	}

	closeAllWindows() {
		this.windowNewMessageRef?.close();
		this.windowCurrentMessageRef?.close();
		this.windowChatListRef?.close();
	}

	onCurrentChatSelected(chatUser: ChatListWithUser): void {
		//this.is_chat++;
		this.newMessage = false;
		this.currentChat = chatUser;
		this.openCurrentMessage();
	}

	getTotalChats(totalChats: number){
       this.countChatList=totalChats;
	}

	isChatNotification(is_chat_notification: boolean){
       this.is_chat_notification=is_chat_notification;
	}

	open() {
		this.dialogService.open(NewMessageComponent, {
			hasBackdrop: true,
			closeOnBackdropClick: false,
			context: null,
		});
	}
	onNewMessageSend(userId): void {
		this.newMessage = false;
		this.windowNewMessageRef.close();
		if (userId !== null) { // if message sent to only one user
			this.togglePreselect = !this.togglePreselect;
			this.userId = userId;
		}

	}
	ngOnDestroy(): void {
		this.closeAllWindows();
		this.subscription?.map((subscription) => subscription.unsubscribe());
	}

	onOpenChatList(){

	  const buttonsConfig: NbWindowControlButtonsConfig = {
		minimize: false,
		maximize: false,
		fullScreen: false,
		close: false,
	  };
	const windowState:NbWindowState =NbWindowState.MAXIMIZED;

	this.windowChatListRef = this.windowService.open(
		this.contentTemplate,
		  {titleTemplate: this.titleTemplate ,windowClass:'message-list-window',
			   initialState: windowState ,hasBackdrop: false, 
			  closeOnEsc: false, context: null,buttons: buttonsConfig }
		);
		setTimeout(() => {
			if (this.currentChat) {
				this.userId = this.currentChat.userId;
				this.togglePreselect = this.togglePreselect === undefined ? true : !this.togglePreselect;
			}
		},100);
  }

  openNewMessage(){
	this.newMessage=true;
	if(this.windowCurrentMessageRef && this.windowCurrentMessageRef._closed==false){
		this.windowCurrentMessageRef.close();
		}
		if(this.windowNewMessageRef && this.windowNewMessageRef._closed==false){
			this.windowNewMessageRef.close();
			}
	const buttonsConfig: NbWindowControlButtonsConfig = {
		minimize: false,
		maximize: false,
		fullScreen: false,
		close: true,
	  };
	const windowState:NbWindowState =NbWindowState.MAXIMIZED;
	this.windowNewMessageRef =this.windowService.open(
		this.newMessageTemplate,
		{ titleTemplate: this.newMessageTitleTemplate, windowClass:'new-message-window', hasBackdrop: false, initialState: windowState,
		closeOnBackdropClick: false, buttons: buttonsConfig, },
	  )
  }
  openCurrentMessage() {
	this.hideActive = null;
	const buttonsConfig: NbWindowControlButtonsConfig = {
		minimize: true,
		maximize: false,
		fullScreen: false,
		close: true,
	  };
	const windowState:NbWindowState =NbWindowState.MAXIMIZED;
	if(this.windowNewMessageRef && this.windowNewMessageRef._closed==false){
	this.windowNewMessageRef.close('manual');
	}
	if(this.windowCurrentMessageRef && this.windowCurrentMessageRef._closed==false){
		this.windowCurrentMessageRef.close('manual');
		}
	this.windowCurrentMessageRef =	this.windowService.open(
		ChatListComponent,
		{titleTemplate: this.curretntMessageTitleTemplate,windowClass:'current-message-window',  hasBackdrop: false, initialState: windowState,closeOnBackdropClick: false,
		 context: {chatUser: this.currentChat, is_chat_notification: this.is_chat_notification, is_currentMessagePopup:true}, buttons: buttonsConfig, },
	  );

	  if (this.windowCurrentMessageRef) {
		this.windowCurrentMessageRef.onClose.subscribe((res)=>{
			if (res == 'manual') { //if closed using the cross button by user
				this.hideActive = false;
			} else {
				this.hideActive = true;
			}
		  });
	  }

  }
	closePopup() {
		this.windowChatListRef?.close();
	}
}
