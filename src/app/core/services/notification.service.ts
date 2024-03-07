import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  currentNotification = new BehaviorSubject(null);
  constructor(
    private messaging: AngularFireMessaging,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {}

  private updateToken(token: string): void {
    this.afAuth.authState.pipe(first()).subscribe((user) => {
      if (!user) {
        return;
      }
      this.afs.doc(`deviceTokens/${user.uid}`).set({ device_token: token });
    });
  }

  getPermission(): void {
    this.messaging.requestPermission
      .pipe(first())
      .toPromise()
      .then(() => this.messaging.getToken.toPromise())
      .then((token) => {
        this.updateToken(token);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  receiveNotification(): void {
    this.messaging
      .onMessage((payload) => {
        this.currentNotification.next(payload);
      })
      .then();
  }
}
