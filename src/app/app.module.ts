import {NgModule} from "@angular/core";


import {AppComponent} from "./app.component";
import {HomeComponent} from "./componenti/home/home.component";
import {AuthenticationComponent} from "./componenti/authentication/authentication.component";


import {AppRoutingModule} from "./app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from "@angular/forms";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticationComponent,
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
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule { }
