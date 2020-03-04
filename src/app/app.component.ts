import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './services/authentication-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  company = 'ng-fbase';
  user$: Observable<firebase.User>;
  currentLink: string;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    this.user$ = this.authenticationService.user$;
  }

  ngOnInit(): void {
    this.currentLink = window.location.pathname;
  }

  signOut() {
    this.authenticationService.SignOut$()
      .subscribe(_ => {
        const returnUrl = window.location.pathname;
        this.router.navigate(['/login'], { queryParams: { returnUrl } });
      });
  }

  linkClicked(currentLink: string) {
    this.currentLink = currentLink;
    this.router.navigate([currentLink]);
  }
}
