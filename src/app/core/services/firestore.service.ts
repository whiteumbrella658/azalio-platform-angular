import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Timestamp } from '@firebase/firestore';
import { v4 as uuid } from 'uuid';
import { LocalStorageService } from './local-storage.service';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, first, last } from 'rxjs/operators';
import { getAnalytics, logEvent } from 'firebase/analytics';
//export type Timestamp = firebase.getFirestore().Timestamp;
export type timeStamp = Timestamp;

export interface ConversationList {
  chatId: string;
  lastMessage: {
    message: string;
    createdAt: timeStamp;
    readAt: timeStamp;
  };
  unreadCount: number;
  read: boolean;
  userId: string;
  modifiedAt: timeStamp;
}

export interface User {
  id: number;
  name: string;
  role_id: number;
  role_title: string;
  show_intro?: boolean;
  phone_number?: string;
  user_color?: string;
}
export interface Message {
  message: string;
  userId: string;
  receiverId?: string;
  sendNotification?: boolean;
  createdAt: timeStamp;
  read: boolean;
  readAt: timeStamp;
}

export interface ChatListWithUser extends ConversationList {
  conversationId: string;
  user: User;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  chatUsers$: Observable<any>;
  constructor(private afs: AngularFirestore, private localStorageService: LocalStorageService) {}

  async getConversationListByUserId(userId: string): Promise<ConversationList & { conversationId: string }> {
    const conversations = await this.afs
      .collection<ConversationList>(`conversationList/${userId}/list`, (ref) => ref.where('userId', '==', this.localStorageService.userId))
      .valueChanges({ idField: 'conversationId' })
      .pipe(first())
      .toPromise();
    return conversations[0];
  }

  getUserMessages(chatId: string): Observable<Message[]> {
    return this.afs.collection<Message>(`messages/${chatId}/chat`, (ref) => ref.orderBy('createdAt')).valueChanges();
  }

  async updateMessagesRead(chatId: string): Promise<void> {
    const messages = await this.afs
      .collection<Message>(`messages/${chatId}/chat`, (ref) => ref.where('receiverId', '==', this.localStorageService.userId))
      .get()
      .pipe(first())
      .toPromise()
      .then((messagesList) => {
        messagesList.forEach((message) => {
          message.ref.update({ read: true });
          if (!message.get('readAt')) {
            message.ref.update({ readAt: Timestamp.now() }).catch((e) => {
              console.log('e in updating readAt firestore service 80:>>', e);
              console.log('-----------------------------------------------------');
            });
          }
        });
      });
  }

  async updateMessageRead(chatId: string): Promise<void> {
    const messages = await this.afs
      .collection<Message>(`messages/${chatId}/chat`, (ref) =>
        ref.where('receiverId', '==', this.localStorageService.userId).where('read', '==', false)
      )
      .get()
      .pipe(last())
      .toPromise()
      .then((messagesList) => {
        messagesList.forEach((message) => message.ref.update({ read: true, readAt: Timestamp.now() }));
      });
  }

  // colle
  getUsersChatList(): Observable<ChatListWithUser[]> {
    const loginUserId = this.localStorageService.userId;
    return this.afs
      .collection<ConversationList & { conversationId: string }>(`conversationList/${loginUserId}/list`, (ref) =>
        ref.orderBy('lastMessage.createdAt', 'desc')
      )
      .valueChanges({ idField: 'conversationId' })
      .pipe(
        switchMap((convsationItem) => {
          const userIds = convsationItem.map<number>(({ userId }) => Number(userId) || 0);
          return combineLatest(
            of(convsationItem),
            combineLatest<Observable<User>>(userIds.map((value) => this.afs.doc<User>(`users/${value}`).valueChanges()))
          );
        }),
        map<[(ConversationList & { conversationId: string })[], User[]], ChatListWithUser[]>(([conversation, chatUsers]) => {
          const x = conversation.map((item) => ({
            ...item,
            user: chatUsers.find((chatUser) => item.userId === chatUser?.id?.toString()),
          }));
          return x;
        })
      );
  }

  sendMessage(
    message: string,
    chatId: string,
    userId: string,
    conversationIdCurrent: string,
    conversationIdOther: string,
    is_chat_notification: boolean
  ): void {
    const loginUserId = this.localStorageService.userId;
    const messageObject = {
      message,
      createdAt: Timestamp.now(),
    };

    this.afs.collection<Message>(`messages/${chatId}/chat`).add({
      ...messageObject,
      userId: loginUserId,
      sendNotification: is_chat_notification,
      receiverId: userId,
      read: false,
      readAt: null,
    });
    // this.afs
    //   .doc<ConversationList>(
    //     `conversationList/${loginUserId}/list/${conversationIdCurrent}`
    //   )
    //   .update({ lastMessage: messageObject });
    // this.afs
    //   .doc<ConversationList>(
    //     `conversationList/${userId}/list/${conversationIdOther}`
    //   )
    //   .update({ lastMessage: messageObject });
  }

  async addChatGroups(userIds: string[], message: string, is_chat_notification: boolean): Promise<void> {
    // const user = await this.afa.user.toPromise();
    const loginUserId = this.localStorageService.userId;
    try {
      const lastMessage = {
        message,
        readAt: null,
        createdAt: Timestamp.now(),
      };
      const chatUsers = await this.afs
        .collection<ConversationList & { conversationId: string }>(`conversationList/${loginUserId}/list`)
        .valueChanges({ idField: 'conversationId' })
        .pipe(first())
        .toPromise();
      const newChatUserIds = userIds
        .filter((item) => !chatUsers.some(({ userId }) => item === userId))
        .map<{ userId: string; chatId: string }>((userId) => ({
          userId,
          chatId: uuid(),
        }));
      const oldChatUserIds = chatUsers
        .filter(({ userId }) => userIds.some((item) => item === userId))
        .map<{ userId: string; chatId: string; conversationId: string }>(({ chatId, conversationId, userId }) => ({
          chatId,
          userId,
          conversationId,
        }));

      const conversationCollection = this.afs.collection<ConversationList>(`conversationList/${loginUserId}/list`);
      const updatesCurrent = oldChatUserIds.map((item) =>
        this.afs.doc<ConversationList>(`conversationList/${loginUserId}/list/${item.conversationId}`).update({ lastMessage, read: true })
      );

      await Promise.all(
        [...oldChatUserIds, ...newChatUserIds].map(({ chatId, userId }) =>
          this.afs.collection<Message>(`messages/${chatId}/chat`).add({
            ...lastMessage,
            userId: loginUserId,
            sendNotification: is_chat_notification,
            receiverId: userId,
            read: false,
          })
        )
      );
      await Promise.all(updatesCurrent);

      const data = await Promise.all([
        ...newChatUserIds.map((item) =>
          conversationCollection.add({
            ...item,
            lastMessage,
            read: true,
            unreadCount: 0,
            modifiedAt: lastMessage.createdAt,
          })
        ),
        ...newChatUserIds.map(({ chatId, userId }) =>
          this.afs.collection(`conversationList/${userId}/list`).add({
            chatId,
            lastMessage,
            read: false,
            userId: loginUserId,
            unreadCount: 0,
          })
        ),
      ]);
    } catch (e) {
      console.error(e);
    }
  }
  //Firebase Analytics
  logEvents(eventName: string): void {
    const analytics = getAnalytics();
    logEvent(analytics, eventName, { name: eventName});
    // shared method to log the events
    //this.analytics.logEvent(eventName);
}
}
