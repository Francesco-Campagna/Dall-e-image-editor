import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef, Input,
  ViewChild
} from '@angular/core';
import OpenAI from "openai";
import {ServiceService} from "../../Service/service";
import { environment } from '../../../../config';
import {DataUrl, NgxImageCompressService} from "ngx-image-compress";





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit{
  @ViewChild('photoInput') myInputPhoto!: ElementRef;



  ngAfterViewInit() {
  }

  apiKey = environment.apiKey;


  private openai = new OpenAI({
    apiKey: this.apiKey,
    dangerouslyAllowBrowser: true
  })


  constructor(private service:ServiceService, private compressImage: NgxImageCompressService) {
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






  async editImageService(){
    if (this.isLoading) return;
    this.setIsLoading(true);

    console.log("PASSO: " +this.forest);
    console.log("PASSO: " +this.forestMask);


    try {

      const response = await this.openai.images.edit({
        model: "dall-e-2",
        image: this.forest,
        mask: this.forestMask,
        prompt: this.inputPrompt,
        n: 1,
        size: "512x512",
      });
      const responseData = response.data[0].url;
      console.log("Response from OpenAI:", responseData);

      this.selectedImage = undefined;
      this.generatedImage = responseData;

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







  fileInputChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedImage = files[0];
      console.log(this.selectedImage);
      this.generatedImage = undefined;
    }
  }



  async fileInputChange1(event: any): Promise<void> {
    const files = event.target.files;
    if (files && files.length > 0) {
      const imageFile = files[0];
      try {
        this.forest = imageFile;
        console.log("Image processed successfully");
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  }



  async fileInputChange2(event: any): Promise<void> {
    const files = event.target.files;
    if (files && files.length > 0) {
      const imageFile = files[0];
      try {
        this.forestMask = imageFile;
        console.log("Image processed successfully");
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
  }

  resetImage(): void {
    this.selectedImage = null;
    this.generatedImage = null;
    this.myInputPhoto.nativeElement.value = "";
  }

  saveImage(): void {
    if (this.selectedImage) {
      this.save(this.selectedImage);
    }else if(this.generatedImage){
      this.saveGenerated(this.generatedImage);
    }
  }

  save(image: any){
    const link = document.createElement('a');
    link.href = URL.createObjectURL(image);
    link.download = image.name;
    link.click();
  }

  saveGenerated(image: any) {
    this.service.saveImage({
      id: 0,
      link: image,
    }).subscribe();
  }





  editImage(){
    this.editImageSelected();
  }


  editImageSelected(){
    this.editImageValue = !this.editImageValue;
  }



  closePopup(){}







  getSelectedImageSrc(): string {
    if (this.selectedImage) {
      return URL.createObjectURL(this.selectedImage);
    }
    return '';
  }


  getGeneratedImage(): string {
    return this.generatedImage;
    if (this.selectedImage) {
      return URL.createObjectURL(this.generatedImage);
    }
    return '';
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
}
