import {Injectable} from '@angular/core';
import {ActivatedRoute} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  sessionId: string | null | undefined;
  utenteCorrente: any;
  isLoggedIn: Boolean = false;


  constructor() {
    this.checkLogin();
  }

  checkLogin(){
    this.isLoggedIn = false;
  }

}
