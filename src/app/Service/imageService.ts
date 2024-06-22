import {Injectable} from '@angular/core';
import {ServiceService} from "./service";
import {Coordinates} from "../Model/Coordinates";


@Injectable({
  providedIn: 'root'
})
export class ImageService{
  private selectedImage: any = null;
  private generatedImage: any = null;

  private editImageValue: boolean = false;
  private editImageConfirmed : boolean = false;
  private coordinates : Coordinates | undefined;
  private formDataForEdit = new FormData();
  private mask: any;

  constructor(private service:ServiceService) { }

  setSelectedImage(image: File): void {
    this.selectedImage = image;
    console.log(this.selectedImage);
  }

  getSelectedImage(): string {
    if(this.selectedImage)
      return URL.createObjectURL(this.selectedImage);
    return "";
  }

  setGeneratedImage(image: File): void {
    this.generatedImage = image;
  }


  getGeneratedImage(): string {
    if(this.generatedImage)
    return URL.createObjectURL(this.generatedImage);
    return "";
  }

  editImageChange(){
    this.editImageValue = !this.editImageValue;
    return this.editImageValue;
  }

  confirmSelection(coordinates: Coordinates | undefined){
    this.editImageConfirmed = true;
    this.coordinates = coordinates;
    this.resetFormDataForMask();
    this.createFormDataForMask();
    this.createMask();
    console.log(this.mask);
  }

  resetEditImageConfirmed(){
    this.editImageConfirmed = false;
  }

  generateRequest(response : string | undefined, prompt : string){
    if(response){
      this.selectedImage = null;
      this.service.downloadGeneratedImageAsFile(response, prompt)
        .then((file) => {
          this.setGeneratedImage(file);
        })
        .catch((error) => {
          console.error('Errore:', error.message);
        });
    }
  }

  getImageForEdit(){
    if(this.selectedImage){
      return URL.createObjectURL(this.selectedImage);
    } else if(this.generatedImage){
      return URL.createObjectURL(this.generatedImage);
    }
    return "";
  }

  resetImage(){
    this.selectedImage = null;
    this.generatedImage = null;
  }


  createFormDataForMask(){
    let image;
    if (this.selectedImage) {
      image = this.selectedImage
    } else if (this.generatedImage) {
      image = this.generatedImage;
    }
    this.formDataForEdit.append("image", image);
    if(this.coordinates){
      this.formDataForEdit.append('top', this.coordinates?.top.toString());
      this.formDataForEdit.append('left', this.coordinates.left.toString());
      this.formDataForEdit.append('width', this.coordinates.width.toString());
      this.formDataForEdit.append('height', this.coordinates.height.toString());
    }
  }

  resetFormDataForMask(){
    this.formDataForEdit = new FormData();
  }


  createMask() {
    this.service.createMask(this.formDataForEdit).subscribe(
      (mask) => {
        this.mask = new File([mask], 'maskedImage.png', {type: 'image/png'}); // Salva l'immagine come File
      }, (error) => {
        console.error('Errore durante il download dell\'immagine:', error.message);
      });
  }


  getMask(){
    return this.mask;
  }


  getImageForApiEditRequest(){
    if(this.selectedImage){
      console.log("SELECTED: " + this.selectedImage)
      return this.selectedImage;
    } else if(this.generatedImage) {
      console.log("GENERATED: " + this.generatedImage)
      return this.generatedImage;
    }
  }

  getChatHistory(){
    return this.service.getChatHistory(1);
  }


  convertPngStringToFile(pngString: string, fileName: string): File {
    // Rimuove l'intestazione data URL se presente
    const base64Data = pngString.replace(/^data:image\/png;base64,/, '');

    // Convertie la stringa base64 in un array di byte
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const blob = new Blob([byteArray], { type: 'image/png' });

    return new File([blob], fileName, {type: 'image/png'});
  }


  getImageForDownload(){
    if(this.selectedImage){
      return this.selectedImage
    }else if(this.generatedImage){
      return this.generatedImage
    }
    return null;
  }

  getEditImageValue(){
    return this.editImageValue;
  }

}
