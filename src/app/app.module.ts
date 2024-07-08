import {NgModule} from "@angular/core";


import {AppComponent} from "./app.component";
import {HomeComponent} from "./componenti/home/home.component";
import {AuthenticationComponent} from "./componenti/authentication/authentication.component";


import {AppRoutingModule} from "./app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {ImageSelectorComponent} from "./componenti/image-selector/image-selector.component";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {AccessComponent} from "./componenti/access/access.component";
import {LoginComponent} from "./componenti/login/login.component";
import {RegistrationComponent} from "./componenti/registration/registration.component";
import {DummyComponentComponent} from "./componenti/dummy-component/dummy-component.component";
import {Interceptor} from "./auth/interceptor";
import {PopupComponent} from "./componenti/popup/popup.component";
import {SettingsComponent} from "./componenti/settings/settings.component";




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticationComponent,
    ImageSelectorComponent,
    AccessComponent,
    LoginComponent,
    RegistrationComponent,
    DummyComponentComponent,
    PopupComponent,
    SettingsComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatMenuModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
