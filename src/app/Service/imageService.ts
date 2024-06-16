import {Injectable, OnInit} from '@angular/core';
import {ServiceService} from "./service";
import {Coordinates} from "../Model/Coordinates";
import {response} from "express";
import {error} from "firebase-functions/lib/logger";

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
    this.generatedImage = null;
    console.log(this.selectedImage);
  }

  getSelectedImage(): string | null {
    return this.selectedImage;
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

  getEditImageConfirmed() {
    return this.editImageConfirmed;
  }

  getCoordinates(){
    return this.coordinates;
  }

  generateRequest(response : string | undefined){
    if(response){
      this.selectedImage = null;
      this.generatedImage = this.downloadGeneratedImageAsFile(response);
      this.service.downloadGeneratedImageAsFile(response)
        .then((file) => {
          this.generatedImage = file;
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
    return undefined;
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
      return this.selectedImage;
    } else if(this.generatedImage) {
      return this.generatedImage;
    }
  }

  downloadGeneratedImageAsFile(generatedImage: any){
    return this.service.downloadGeneratedImageAsFile(generatedImage);
  }

  getChatHistory(){
    return this.service.getChatHistory(1);
  }



}
