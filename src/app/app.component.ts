import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './services/authentication-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  company = 'ng-fbase';
  user$: Observable<firebase.User>;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.user$ = this.authenticationService.user$;
  }

  signOut() {
    this.authenticationService.SignOut$()
      .subscribe(_ => {
        const returnUrl = window.location.pathname;
        this.router.navigate(['/login'], { queryParams: { returnUrl } });
      });
  }
}
