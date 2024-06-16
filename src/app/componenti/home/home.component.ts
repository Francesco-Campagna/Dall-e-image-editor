import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef, Input, OnInit,
  ViewChild
} from '@angular/core';
import OpenAI from "openai";
import {ServiceService} from "../../Service/service";
import { environment } from '../../../../config';
import {DataUrl, NgxImageCompressService} from "ngx-image-compress";
import {ImageService} from "../../Service/imageService";
import {Observable} from "rxjs";





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit{
  //@ViewChild('photoInput') myInputPhoto!: ElementRef;

  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit() {
    //this.generatedImage = this.imageService.getGeneratedImage();

    const targetElement = this.elementRef.nativeElement.querySelector('.sidebar');

    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        // Verifica solo le modifiche di altezza
        if (entry.contentRect.height !== entry.contentRect.width) {
          console.log('Altezza dell\'elemento è cambiata:', entry.contentRect.height);
          // Esegui qui le azioni desiderate in risposta al cambiamento di altezza
          this.updateChatMaxHeight();
        }
      }
    });

    this.resizeObserver.observe(targetElement);
  }

  apiKey = environment.apiKey;


  private openai = new OpenAI({
    apiKey: this.apiKey,
    dangerouslyAllowBrowser: true
  })


  constructor(private service:ServiceService, private compressImage: NgxImageCompressService, private imageService:ImageService, private cdr: ChangeDetectorRef, private elementRef: ElementRef) {
  }



  forest: any;
  forestMask: any;





  // Define variables
  inputPrompt: string = "";
  selectedStyle: string = "";
  selectedMood: string = "";
  activeTab: string = "manual";
  isLoading: boolean = false;
  defaultStyle: string = "Oil Painting";
  defaultMood: string = "Serene";
  selectedImage: any = null;
  generatedImage: any = null;
  editImageValue: boolean = false;




  setActiveTab(tab: string): void {
    this.activeTab = tab;
    const selectRow: HTMLElement | null = document.querySelector(".select-row");
    if (tab === "manual") {
      if (selectRow){
        this.selectedStyle = "";
        this.selectedMood = "";
        selectRow.style.pointerEvents = "auto";

      }
    } else {
      if (selectRow){
        const selectedStyle: HTMLSelectElement = document.getElementById("selectedStyle") as HTMLSelectElement;
        selectedStyle.value = this.defaultStyle
        this.selectedStyle = this.defaultStyle;

        const selectedMood: HTMLSelectElement = document.getElementById("selectedMood") as HTMLSelectElement;
        selectedMood.value = this.defaultMood;
        this.selectedMood =this.defaultMood;

        selectRow.style.pointerEvents = "none";
      }
    }
  }


  async handleSubmit() {
    //console.log(this.selectedStyle);
    //console.log(this.selectedMood);

    if(this.inputPrompt == ""){
      alert("You must provide a prompt");
    }

    this.setIsLoading(true);

    let combinedPrompt: string = `${this.inputPrompt}`;

    if(this.selectedStyle){
      combinedPrompt = `${combinedPrompt}, Style: ${this.selectedStyle}`;
    }
    if(this.selectedMood){
      combinedPrompt = `${combinedPrompt}, Mood: ${this.selectedMood}`;
    }

    if(this.openai == undefined){
      console.error('OpenAI non è disponibile lato server.');
      return;
    }

    try {

      const response = await this.openai.images.generate({
        model: "dall-e-2",
        prompt: combinedPrompt,
        n: 1,
        size: "512x512",
      });
      const responseData = response.data[0].url;
      console.log("Response from OpenAI:", responseData);

      this.selectedImage = undefined;
      this.generatedImage = responseData;
      this.imageService.generateRequest(responseData);
      this.cdr.detectChanges();

    } catch (error) {
      console.error("Error generating the image:", error);
      alert(
        "Failed to generate the image. Check the console for more details."
      );
    }
    finally {
      this.setIsLoading(false);
    }
  }






  async callToEditOpenAi(image: any, mask: any){
    if (this.isLoading) return;
    this.generatedImage = null;
    this.selectedImage = null;
    this.setIsLoading(true);

    console.log("PASSO: " +this.forest);
    console.log("PASSO: " +this.forestMask);


    try {

      const response = await this.openai.images.edit({
        model: "dall-e-2",
        image: image,
        mask: mask,
        prompt: this.inputPrompt,
        n: 1,
        size: "512x512",
      });
      const responseData = response.data[0].url;
      console.log("Response from OpenAI:", responseData);

      this.selectedImage = undefined;
      this.generatedImage = responseData;
      this.imageService.generateRequest(responseData);
      this.cdr.detectChanges();

    } catch (error) {
      console.error("Error generating the image:", error);
      alert(
        "Failed to generate the image. Check the console for more details."
      );
    }
    finally {
      this.setIsLoading(false);
    }
  }


  editImageService() {
    let image = this.imageService.getImageForApiEditRequest();
    let mask = this.imageService.getMask();
    this.callToEditOpenAi(image, mask);
  }







  fileInputChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedImage = files[0];
      console.log(this.selectedImage);
      this.generatedImage = undefined;
      this.imageService.setSelectedImage(files[0]);
      this.cdr.detectChanges();
    }
  }



  resetImage(): void {
    if(this.editImageValue){
      alert("Terminare l'edit dell'immagine prima del reset");
      return;
    }
    this.selectedImage = null;
    this.generatedImage = null;
    this.imageService.resetImage();
  }

  saveImage(): void {
    if (this.selectedImage) {
      return;
    }else if(this.generatedImage){
      this.saveGenerated();
    }
  }

  save(image: any){
    const link = document.createElement('a');
    link.href = URL.createObjectURL(image);
    link.download = image.name;
    link.click();
  }

  saveGenerated() {
    const imageData = { link: this.generatedImage, chatTitle: this.inputPrompt, userId: 1 };
    this.service.saveImage(imageData).subscribe(
      response => {
        console.log('Immagine salvata con successo:', response);
      },
      error => {
        console.error('Errore durante il salvataggio dell\'immagine:', error);
      }
    );
  }






  editImage() {
    this.editImageValue = this.imageService.editImageChange();
  }




  getSelectedImageSrc(): string {
    if (this.selectedImage) {
      return URL.createObjectURL(this.selectedImage);
    }
    else if(this.generatedImage){
      return this.generatedImage;
    }
    return '';
  }


  getGeneratedImage(): string {
    return this.imageService.getGeneratedImage();
  }





  // Function to set the style
  setStyle(event : any) {
    this.selectedStyle = event.target.value;
  }

  // Function to set the mood
  setMood(event : any){
    this.selectedMood = event.target.value;
  }

  // Function to set isLoading
  setIsLoading(value: boolean): void {
    this.isLoading = value;
  }



  updateChatMaxHeight(): void {
    const sidebar = document.querySelector('.sidebar') as HTMLElement | null;

    if (sidebar !== null) {
      const homeHeight = sidebar.offsetHeight;
      document.documentElement.style.setProperty('--chat-max-height', `${homeHeight - 114}px`);
    } else {
      console.error('Elemento .home non trovato.');
    }
  }
}
