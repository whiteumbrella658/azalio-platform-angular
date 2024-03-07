import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { GeneralService } from 'src/app/core/services/general.service';
import { NewMessageComponent } from '../../components/new-message/new-message.component';
import { ChatListWithUser, FirestoreService } from '../../../../core/services/firestore.service';
import { Subscription } from 'rxjs';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import { Router } from '@angular/router';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { config } from 'src/environments/configuration';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';

@Component({
	selector: 'app-communication-page',
	templateUrl: './communication-page.component.html',
	styleUrls: ['./communication-page.component.scss'],
})
export class CommunicationPageComponent implements OnInit, OnDestroy {
    currentChat: ChatListWithUser;
	userChatList: ChatListWithUser[] = [];
	subscription: Subscription[] = [];
    is_chat_notification:boolean; //for 1781
	newMessage: boolean;
	showTempClass: boolean = true;
	countChatList:number;
	togglePreselect: boolean;
	userId: Number;
    loading:boolean;
	textMessage:string;
	hideSurvey: boolean;
	constructor(
		public storageService: LocalStorageService,
		private dataService: DataSharedService,
		private gs: GeneralService,
		private dialogService: NbDialogService,
		private firestoreService: FirestoreService,
		private router: Router
	) {}
	options: AnimationOptions = {
		path:  'https://assets7.lottiefiles.com/packages/lf20_cepgemlt.json'
	  };
	  onAnimate(animationItem: AnimationItem): void {
		//console.log(animationItem);
	  }
	ngOnInit(): void {
		this.gs?.hideSplashScreen();
		if (config.environment?.toLowerCase() === 'prod' || config.environment?.toLowerCase() === 'production') {
			this.hideSurvey = true;
		}
		this.loading=true;
		this.textMessage="Click 'New Message' to connect with your team members.";
		this.togglePreselect = false;
	}
	onCurrentChatSelected(chatUser: ChatListWithUser): void {
		this.newMessage = false;
		this.currentChat = chatUser;
	}

	getTotalChats(totalChats: number){
	 if( totalChats){
		this.textMessage='Select an item to read.'
	   }
	  
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
		if (userId !== null) {
			this.userId = userId;
			this.togglePreselect = !this.togglePreselect;
		}
	}

	goToSurvey() {
		this.router.navigate(['communication/survey'])
	}
	ngOnDestroy(): void {
		this.subscription?.map((subscription) => subscription.unsubscribe());
	}
}
