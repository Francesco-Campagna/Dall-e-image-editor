import { Component } from '@angular/core';
import {ActivatedRoute, Router, withPreloading} from "@angular/router";
import {AuthService} from "../../auth/auth.service";
import {LoginRequestDto} from "../../Model/LoginRequestDto";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string | undefined;
  password : string | undefined;
  errorMessage = 'Invalid Credentials';
  invalidLogin = false;

  constructor(
    private router: Router,
    private authenticationService: AuthService) {   }


  handleLogin() {
    if (this.email && this.password){
      const loginDto = new LoginRequestDto();
      loginDto.email = this.email;
      loginDto.password = this.password;
      this.authenticationService.login(loginDto).subscribe((result)=> {
        this.invalidLogin = false;
        this.router.navigate(['/home']).then(() => {
          window.location.reload();
        });
      }, () => {
        this.invalidLogin = true;
      });
    } else {
      this.invalidLogin = true;
    }
  }

}
