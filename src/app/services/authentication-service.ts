import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user$: Observable<firebase.User>;

  constructor(private angularFireAuth: AngularFireAuth) {
    this.user$ = angularFireAuth.authState;
  }

  SignIn = (email: string, password: string): Promise<firebase.auth.UserCredential> =>
    this.angularFireAuth
      .auth
      .signInWithEmailAndPassword(email, password)

  SignOut = (): Promise<void> =>
    this.angularFireAuth
      .auth
      .signOut()
}
