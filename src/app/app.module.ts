import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { AuthGuard } from './guard/auth.guard';
import { CanDeactivateGuard } from './guard/can-deactivate.guard';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ItemListComponent } from './item-list/item-list.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './services/authentication-service';
import { DialogService } from './services/dialog.service';
import { WelcomeComponent } from './welcome/welcome.component';


@NgModule({
  declarations: [
    AppComponent,
    ConfirmModalComponent,
    ItemDetailComponent,
    ItemListComponent,
    LoginComponent,
    WelcomeComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    AuthenticationService,
    AuthGuard,
    CanDeactivateGuard,
    DialogService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
