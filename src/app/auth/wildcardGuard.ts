import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WildcardGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      console.log('User is logged in, navigating to /home');
      this.router.navigate(['/home']);
    } else {
      console.log('User is not logged in, navigating to /access');
      this.router.navigate(['/access']);
    }
    return false;
  }
}
