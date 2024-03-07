import { 
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy,
  ViewChild,
  AfterViewChecked,
} from '@angular/core';
import {
  ChatListWithUser,
  ConversationList,
  FirestoreService,
  Message,
} from '../../../../core/services/firestore.service';
import { Observable, Subscription } from 'rxjs';
import { LocalStorageService } from '../../../../core/services/local-storage.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NbChatComponent } from '@nebular/theme';
import { DataSharedService } from 'src/app/core/services/data-shared.service';
import moment from 'moment';
import { avatarOpacity } from 'src/constants';
import { GeneralService } from 'src/app/core/services/general.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('chatComponent') chatComponent: NbChatComponent;
  opacity: string;
  constructor(
    private gs: GeneralService,
    private firestoreService: FirestoreService,
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) { }

  userChat$: Observable<Message[]>;
  userMessage: Message[] = [];
  chatSubscription: Subscription;
  loginUserId: string;
  otherConversation: ConversationList & { conversationId: string };
  currentUser: any;
  @Input() chatUser: ChatListWithUser;
  @Input() is_chat_notification: boolean;
  @Input() is_currentMessagePopup:boolean;
  lastSeenMessageIndex: number;
  lastSeenMessageTime: any;
  cache : number = -1;
  getSortedMessageIndex(value: Message): number {
    let low = 0;
    let high = this.userMessage.length;

    while (low < high) {
      // tslint:disable-next-line:no-bitwise
      const mid = (low + high) >>> 1;
      if (this.userMessage[mid].createdAt.nanoseconds < value.createdAt.nanoseconds) {
        low = mid + 1;
      } else {
        high = mid;
      }

    }
    return low;
  }

  async ngOnInit(): Promise<void> {
    this.opacity = avatarOpacity.toString();
    this.currentUser = await this.authService.getUser();
    this.loginUserId = this.localStorageService.userId;
    if (this.chatUser) {
      this.chatSubscription = this.firestoreService
      .getUserMessages(this.chatUser.chatId)
      .subscribe((messages) => {
        this.lastSeenMessageIndex = -1
        for (let i = 0; i < messages.length; i++) {
          if (messages[i]?.read && messages[i]?.readAt && this.loginUserId == messages[i].userId) {
            this.cache = i
            this.lastSeenMessageTime = this.convertDate(messages[i]?.readAt?.toDate())
          }
        }
        this.lastSeenMessageIndex = this.cache
        if (this.userMessage.length === 0 && messages.length > 0) {
          this.userMessage = messages;
        } else if (this.userMessage.length < messages.length) {
          const slicedMessages = messages.slice(this.userMessage.length);
          const newMessages = slicedMessages.sort((a, b) => a.createdAt.nanoseconds - b.createdAt.nanoseconds)
          for (const msg of newMessages) {
            this.userMessage.push(msg);
          }
        }

        if (!messages[messages.length - 1].read) {
          this.firestoreService.updateMessagesRead(this.chatUser.chatId).then();
        }
      });
    this.otherConversation =
      await this.firestoreService.getConversationListByUserId(
        this.chatUser.userId
      );
  }
    }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes.chatUser.previousValue) {
      if (
        changes.chatUser.previousValue.chatId !=
        changes.chatUser.currentValue.chatId
      ) {
        this.firestoreService
          .updateMessagesRead(changes.chatUser.currentValue.chatId)
          .then();
      }
    }
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
      this.userMessage = [];
      this.chatSubscription = this.firestoreService
        .getUserMessages(this.chatUser.chatId)
        .subscribe((messages) => {
          this.lastSeenMessageIndex = -1
          for (let i = 0; i < messages.length; i++) {
            if (messages[i]?.read && messages[i]?.readAt && this.loginUserId == messages[i].userId) {
              this.cache = i
              this.lastSeenMessageTime = this.convertDate(messages[i]?.readAt?.toDate())
            } 
          }
          this.lastSeenMessageIndex = this.cache
          if (this.userMessage.length === 0 && messages.length > 0) {
            this.userMessage = messages;
          } else if (this.userMessage.length < messages.length) {
            const slicedMessages = messages.slice(this.userMessage.length);
            const newMessages = slicedMessages.sort((a, b) => a.createdAt.nanoseconds - b.createdAt.nanoseconds)
            for (const msg of newMessages) {
              this.userMessage.push(msg);
            }
          }
        });
    }
  }

  /**
   * SEND MESSAGE IN EXISITING CONVERSATION
   * @param message
   */
  async sendMessages({ message, }: {
    message: string;
    files: File[];
  }): Promise<void> {

    await this.firestoreService.sendMessage(
      message,
      this.chatUser.chatId,
      this.chatUser.userId,
      this.chatUser.conversationId,
      this.otherConversation.conversationId,
      this.is_chat_notification
    );
  }

  ngOnDestroy(): void {
    if (this.chatSubscription) {
      this.chatSubscription?.unsubscribe();
    }
  }

  convertDate(date){
    return moment(date).format('MM/D/YYYY hh:mm A')
  }
}
