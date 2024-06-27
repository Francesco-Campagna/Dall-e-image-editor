import { Injectable } from '@angular/core';
import {CanLoad, Route, UrlSegment, Router, CanActivate} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // supponendo che ci sia un servizio AuthService per la gestione dell'autenticazione

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/access']);
      return false;
    }
    return true;
  }
}
