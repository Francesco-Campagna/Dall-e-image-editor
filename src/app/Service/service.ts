import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Image} from "../Model/Image";
import {Observable} from "rxjs";
import {FileLike} from "openai/uploads";
import {toFile} from "openai";
import {Chat} from "../Model/Chat";
import {User} from "../Model/User";
import {response} from "express";
import {AuthService} from "../auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  token: string | null = null;

  constructor(private http: HttpClient, private auth:AuthService) {
    this.token = localStorage.getItem('token');
  }

  initializeHeaders(){
    return new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
  }

  saveImage(imageData: { chatTitle: string; link: any; token: string | null }) {
    let headers = this.initializeHeaders();
    return this.http.post('http://localhost:8080/api/image/save', imageData, {headers})
  }

  createMask(formData: FormData) {
    let headers = this.initializeHeaders();
    return this.http.post('http://localhost:8080/api/image/createMask', formData, { responseType: 'blob', headers });
  }

  downloadGeneratedImageAsFile(generatedImage: string, fileName: string): Promise<File> {
    return new Promise((resolve, reject) => {
      let headers = this.initializeHeaders();
      this.http.post('http://localhost:8080/api/image/convert-generated-to-file', { generatedImage, fileName }, {
        responseType: 'blob', headers
      }).subscribe(blob => {
        const file = new File([blob], fileName, { type: 'image/png' });
        resolve(file);
        console.log(file);
      }, error => {
        reject(error);
      });
    });
  }

  getChatHistory(): Observable<Chat[]> {
    let headers = this.initializeHeaders();
    return this.http.get<Chat[]>('http://localhost:8080/api/chat/history', { headers });
  }

  deleteChat(chat: Chat){
    let headers = this.initializeHeaders();
    return this.http.delete('http://localhost:8080/api/image/delete/' + chat.id, {headers});
  }







}
