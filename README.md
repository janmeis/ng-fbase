## Authenticating application against Firebase
#### Prerequisities
- Install node
- Install angular CLI _npm install -g @angular/cli_
- Register as a Firebasse user with you gmail account
- Create the github acccount (optional)
### Create application
- Github create repository (_ng-fbase_)
- Create ng project (_ng new ng-base --routing -S --style scss_)
- Import project using instructions on github pages (_cd ./ng-fbase_)
- Firebase console - create project with the same name (_ng-fbase_)
  * Authentication/Users/Add User with email and password
  * Authentication/Sign-in method/Sign in providers - email/password enable
- Add firebase to ng project [AngularFire Quickstart](https://github.com/angular/angularfire/blob/master/docs/install-and-setup.md);
[npm install firebase @angular/fire --save](https://www.npmjs.com/package/@angular/fire), you must also add AngularFireModule and AngularFireAuthModule to imports in app module.
- Update environment/firebase according setting found in firebase console
  * apiKey: _Project overview - settings icon/Project setting/Web Api key,_
  * authDomain: _Authentication/Authorized domains/2nd line,_
  * databaseURL: _for storing data,_
  * projectId: _Project overview - settings icon/Project setting/Project Id,_
  * storageBucket: _'\<your-storage-bucket>',_
  * messagingSenderId: _'\<your-messaging-sender-id>'_
- For nice look add bootstrap to the project [How to add bootstrap to your angular project (Angular 8)](https://medium.com/@oyewusioyekunle/how-to-add-bootstrap-to-your-angular-project-angular-8-6379fd6a0f46):
_npm i bootstrap jquery popper.js --save_, edit angular.json to add bootstrap.
Modify the front page with some menu to see bootstrap is working e.g. from [Bootstrap Examples](https://getbootstrap.com/docs/4.4/examples/)
- Create the login page, you can use [Sign In Example](https://getbootstrap.com/docs/4.4/examples/sign-in/), you must play a bit with styles on both the app component page and login page
- Create AuthenticationService based on [Authenticate with Firebase using Password-Based Accounts using Javascript](https://firebase.google.com/docs/auth/web/password-auth) or [Firebase Email Password Authentication in Angular 8 Application](https://jsonworld.com/demo/firebase-email-password-authentication-in-angular-application)
_ng g s ./services/authentication_; add to app.module/providers
Inject (private angularFireAuth: AngularFireAuth), use this.angularFireAuth.auth.  
You can omit the sign up method as you can sign up in the firebase console, but add the _userData = angularFireAuth.authState_ for use in auth guard
- Add AuthenticationService to providers in app module
- Create the auth guard [canActivate firebase auth route implementation](https://github.com/angular/angularfire/issues/282#issuecomment-228514876), use  
   `constructor(private router: Router,  private authenticationService: AuthenticationService) { }`  
In the canActivate mehod body:  
  `return this.authenticationService.userData.pipe(map((user: User) => !!user), tap(authenticated => {if (!authenticated) this.router.navigate(['/login'], {queryParams: { returnUrl: state.url   } });), first());`  
Also add auth guard to providers in app module
- Modify the app routing file like:  
  `const routes: Routes = [{ path: '', pathMatch: 'full', redirectTo: '/welcome'}, {path: 'login', component: LoginComponent}, {path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard]}];`
- Now you can make the login page to live.
- Refactoring: firebase calls in authentication service wrapped in observables not to mix observables/promises and to use pipe.

## Store data in firestore
[Angular + Cloud Firestore — Step by step (bootstrap) tutorial](https://medium.com/factory-mind/angular-cloud-firestore-step-by-step-bootstrap-tutorial-ecb96db8d071)
- Add firestore to you firebase ng-fbase account: Firebase console/Database/Create database, start in test mode, Cloud firestore location
- Update environment/firebase according setting found in firebase console
  * databaseURL: _https://----.firebaseio.com/_ found on the top of the modal if you switch to realtime database (---- is the same as project Id)
- Add AngularFirestoreModule to imports in app module.
- Add item list and item detail pages to the project and update routes in app routing
- Modify app component menu, notice the active class that works thanks to [Angular Location](https://angular.io/api/common/Location)
- the item list was originally constructed using `this.items=this.db.collection('/Items').valueChanges()`. Unfortunatelly this returns only data with no document ids, so it is suitable only for display and not for editing and deleteng items. To overcome this issue a little bit strange construction using two `this.db.collection('/Items')` calls returning Items with document ids observable had to be used.
- the item detail is for editing, adding new item.
- Possible refactorings: Validation, Error handling, error messages, warning message (Sure to delete item?), the cancel button, change of the menu item from item list to item detail, move data display and editing or use modal.
Move all firestore calls to a separate service.

### .NET Core backend + Typewriter/NSwag code generation
https://frhagn.github.io/Typewriter/  
https://docs.microsoft.com/en-us/aspnet/core/tutorials/getting-started-with-nswag?view=aspnetcore-3.1&tabs=visual-studio&source=docs
	
### Localization using Transloco
https://netbasal.com/introducing-transloco-angular-internationalization-done-right-54710337630c
