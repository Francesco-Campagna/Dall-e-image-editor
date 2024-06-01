import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {HomeComponent} from "./componenti/home/home.component";
import {AccessComponent} from "./componenti/access/access.component";
import {ImageSelectorComponent} from "./componenti/image-selector/image-selector.component";
import {LoginComponent} from "./componenti/login/login.component";
import {RegistrationComponent} from "./componenti/registration/registration.component";


const routes: Routes = [
  {path: "", redirectTo: 'home', pathMatch: 'full'},
  {path: "home", component: HomeComponent},
  {path: "access", component: AccessComponent},
  {path: "selector", component: ImageSelectorComponent},
  {path: "login", component: LoginComponent},
  {path: "registration", component: RegistrationComponent},


];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
