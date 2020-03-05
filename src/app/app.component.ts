import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './services/authentication-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
})
export class AppComponent implements OnInit {
  company = 'ng-fbase';
  user$: Observable<firebase.User>;

  constructor(
    private authenticationService: AuthenticationService,
    public location: Location,
    private router: Router
  ) {
    this.user$ = this.authenticationService.user$;
  }

  ngOnInit(): void {
  }

  signOut() {
    this.authenticationService.SignOut$()
      .subscribe(_ => {
        const returnUrl = window.location.pathname;
        this.router.navigate(['/login'], { queryParams: { returnUrl } });
      });
  }
}
