import { Component } from '@angular/core';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent {
  isLoggin: boolean = false;

  constructor(public auth: AuthService) {
    this.isLoggin = this.auth.isLoggedIn();
  }

  handleClick(){
    if (this.checkLogin()){
      this.auth.logout();
      console.log("logout")
    }else{
      window.open('http://localhost:4200/access', '_self');
    }
  }

  checkLogin(){
    return this.auth.isLoggedIn();

  }

}
