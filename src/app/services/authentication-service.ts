import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { first } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user$: Observable<firebase.User>;
  sessionTimeout: any;

  constructor(private angularFireAuth: AngularFireAuth) {
    this.user$ = angularFireAuth.authState;
    // angularFireAuth.auth.onAuthStateChanged((user) => {
    //   if (user == null) {
    //     // User is logged out.
    //     // Clear the session timeout.
    //     clearTimeout(this.sessionTimeout);
    //     this.sessionTimeout = null;
    //   } else {
    //     // User is logged in.
    //     // Fetch the decoded ID token and create a session timeout which signs the user out.
    //     user.getIdTokenResult().then((idTokenResult) => {
    //       // Make sure all the times are in milliseconds!
    //       const authTime = idTokenResult.claims.auth_time * 1000;
    //       const sessionDuration = 1000 * 60 * 60 * 24 * 30;
    //       const millisecondsUntilExpiration = sessionDuration - (Date.now() - authTime);
    //       this.sessionTimeout = setTimeout(() => angularFireAuth.auth.signOut(), millisecondsUntilExpiration);
    //     });
    //   }
    // });
  }

  SignIn$ = (email: string, password: string): Observable<firebase.auth.UserCredential> =>
    from(this.angularFireAuth
      .auth
      .signInWithEmailAndPassword(email, password)).pipe(
        tap((credentials: firebase.auth.UserCredential) => console.log(`Succesfully signed in as '${credentials.user.email}'`)),
        first()
      )

  SignOut$ = (): Observable<void> =>
    from(this.angularFireAuth
      .auth
      .signOut()).pipe(
        tap(_ => console.log('Succesfully signed out')),
        first()
      )
}
