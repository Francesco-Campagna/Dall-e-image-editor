import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {HomeComponent} from "./componenti/home/home.component";
import {AccessComponent} from "./componenti/access/access.component";
import {LoginComponent} from "./componenti/login/login.component";
import {RegistrationComponent} from "./componenti/registration/registration.component";
import {AuthGuard} from "./auth/AuthGuard";
import {WildcardGuard} from "./auth/WildcardGuard";
import {DummyComponentComponent} from "./componenti/dummy-component/dummy-component.component";


const routes: Routes = [
  { path: 'access', component: AccessComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'wildcard-redirect', component: DummyComponentComponent, canActivate: [WildcardGuard] }, // Rotta fittizia per il wildcard guard
  { path: '**', redirectTo: 'wildcard-redirect' } // Rotta jolly per tutte le altre rotte
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
