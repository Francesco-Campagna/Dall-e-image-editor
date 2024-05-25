import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Image} from "../Model/Image";
import {map, Observable} from "rxjs";
import {FileLike, Uploadable} from "openai/uploads";
import {toFile} from "openai";

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) {
  }

  saveImage(body : {}) {
    return this.http.post('http://localhost:8080/api/image/save', body);
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





}
