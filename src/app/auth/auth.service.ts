import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {LoginRequestDto} from "../Model/LoginRequestDto";
import {RegistrationRequestDto} from "../Model/RegistrationRequestDto";
import {User} from "../Model/User";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080';


  token: string | null;
  apiKey: string | null;


  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token');
    this.apiKey = "";
  }

  login(loginDto: LoginRequestDto): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(`${this.apiUrl}/api/user/login`, loginDto, { headers: headers, observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        const token = response.headers.get('Authorization');
        if (token) {
          const bearerToken = token.replace('Bearer ', '');
          localStorage.setItem('token', bearerToken);
          this.token = bearerToken;
        }
        return response.body;
      }),
      catchError(error => {
        console.log("login error");
        return throwError(error);
      })
    );
  }


  logout() {
    localStorage.removeItem('token');
    window.location.reload();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }


  register(registrationDto: RegistrationRequestDto): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    return this.http.post<any>(`${this.apiUrl}/api/user/register`, registrationDto, {
      headers: headers,
      observe: 'response'
    }).pipe(
      map((response: HttpResponse<any>) => {
        const token = response.headers.get('Authorization');
        if (token) {
          const bearerToken = token.replace('Bearer ', '');
          localStorage.setItem('token', bearerToken);
          console.log("TOKEN: " + bearerToken)

        }
        console.log(response);

        return response.body;
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

}
