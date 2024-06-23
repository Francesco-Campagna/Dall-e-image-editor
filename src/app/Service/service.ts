import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Image} from "../Model/Image";
import {Observable} from "rxjs";
import {FileLike} from "openai/uploads";
import {toFile} from "openai";
import {Chat} from "../Model/Chat";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) {
  }

  saveImage(imageData: { link: string, chatTitle: string, userId: number }) {
    return this.http.post('http://localhost:8080/api/image/save', imageData);
  }


  createMask(formData: FormData) {
    return this.http.post('http://localhost:8080/api/image/createMask', formData, { responseType: 'blob' });
  }

  downloadGeneratedImageAsFile(generatedImage: string, fileName: string): Promise<File> {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:8080/api/image/convert-generated-to-file', { generatedImage, fileName }, {
        responseType: 'blob'
      }).subscribe(blob => {
        const file = new File([blob], fileName, { type: 'image/png' });
        resolve(file);
        console.log(file);
      }, error => {
        reject(error);
      });
    });
  }

  getChatHistory(userId: number): Observable<Chat[]> {
    return this.http.get<Chat[]>('http://localhost:8080/api/chat/history/' + userId);
  }

  deleteChat(chat: Chat){
    return this.http.delete('http://localhost:8080/api/chat/delete/' + chat.id);
  }







}
