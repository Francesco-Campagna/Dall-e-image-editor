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



  getImageById(id: string): Observable<Image>{
    return this.http.get<Image>('http://localhost:8080/api/image/getImage/' + id);
  }

  getImageAsFileLike(filename: string): Observable<FileLike> {
    return new Observable<FileLike>((observer) => {
      this.http.get(`http://localhost:8080/api/image/${filename}`, { responseType: 'arraybuffer' }).subscribe({
        next: async (arrayBuffer: ArrayBuffer) => {
          // Creazione di un oggetto FileLike utilizzando la funzione toFile
          const fileLike: FileLike = await toFile(arrayBuffer, filename);
          observer.next(fileLike);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  /*
  createMask(formData: FormData): Observable<FileLike> {
    return new Observable<FileLike>((observer) => {
      this.http.get(`http://localhost:8080/api/image/createMask/${formData}`, { responseType: "arraybuffer"}).subscribe({
        next: async (arrayBuffer: ArrayBuffer) => {
          const fileLike: FileLike = await toFile(arrayBuffer, "mask.png");
          observer.next(fileLike);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

   */

  createMask(formData: FormData) {
    return this.http.post('http://localhost:8080/api/image/createMask', formData, { responseType: 'blob' });
  }

  downloadGeneratedImageAsFile(generatedImage: string): Promise<File> {
    return new Promise((resolve, reject) => {
      this.http.post('http://localhost:8080/api/image/convert-generated-to-file', { generatedImage }, {
        responseType: 'blob'
      }).subscribe(blob => {
        const file = new File([blob], 'generated-image.png', { type: 'image/png' });
        resolve(file);
        console.log(file);
      }, error => {
        reject(error);
      });
    });
  }

  getChatHistory(userId: number): Observable<Chat[]> {
    return this.http.get<Chat[]>('http://localhost:8080/api/image/chat/history/' + userId);
  }







}
