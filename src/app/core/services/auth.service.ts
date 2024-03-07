import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { switchMap, first, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
 // authUser:any=new BehaviorSubject<[]>(null);
  user$: Observable<any>;
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }
  getUser(): Promise<any> {
    return this.user$.pipe(first()).toPromise();
  }

  async signIn(token: string, user: any): Promise<void> {
    await this.afAuth.signInWithCustomToken(token);
    return this.updateUserDate(user);
  }
  
  async updateRecognitionNotification(): Promise<void> {
    const user = await this.getUser();
    
    if (user?.showRecognitionNotification === true) {
      return this.afs.doc(`users/${user.id}`).update({showRecognitionNotification: false});
    }
    return;
  }

  updateUserDate(user: any): Promise<void> {
    return this.afs.doc(`users/${user.id}`).update(user);
  }
  async signOut(): Promise<void> {
    await this.afAuth.signOut();
  }

  async setFirebaseToken(token: string): Promise<void> {
    await this.afAuth.signInWithCustomToken(token);
    //return this.updateUserDate(user);
  }
}
