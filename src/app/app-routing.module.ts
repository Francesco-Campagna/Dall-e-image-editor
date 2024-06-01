import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {HomeComponent} from "./componenti/home/home.component";
import {LoginComponent} from "./componenti/login/login.component";
import {ImageSelectorComponent} from "./componenti/image-selector/image-selector.component";


const routes: Routes = [
  {path: "", component: HomeComponent},
  {path: "login", component: LoginComponent},
  {path: "selector", component: ImageSelectorComponent}

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
