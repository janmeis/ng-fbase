import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  company = 'ng-fbase';
  user$: Observable<firebase.User>;

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.user$ = this.authenticationService.user$;
  }

  async signOut() {
    await this.authenticationService.SignOut();
    window.location.reload();
  }
}
