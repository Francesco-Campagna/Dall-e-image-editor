import {
  AfterViewInit,
  Component,
  ElementRef,
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
  @ViewChild('myCanvas') myCanvas!: ElementRef;


  apiKey = environment.apiKey;




  private openai = new OpenAI({
    apiKey: this.apiKey,
    dangerouslyAllowBrowser: true
    })


  constructor(private service:ServiceService, private compressImage: NgxImageCompressService) {
  }


  forest: any;
  forestMask: any;
  ngAfterViewInit() {
    /*
    this.service.getImageById("7").subscribe({
      next: (img) =>{
        this.compressImage
          .compressFile(<DataUrl>img.link, -1, 50, 50) // 50% ratio, 50% quality
          .then(compressedImage => {
            this.generatedImage = compressedImage;
          })
      }
    })

     */
  }



























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


  // Function to handle form submission
  async handleSubmit() {
    console.log(this.selectedStyle);
    console.log(this.selectedMood);

    if(this.selectedStyle == "" || this.selectedMood == "" || this.inputPrompt == ""){
      return;
    }

    this.setIsLoading(true);


    const combinedPrompt: string = `${this.inputPrompt}, Style: ${this.selectedStyle}, Mood: ${this.selectedMood}`;
    console.log(combinedPrompt);


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
      this.setIsLoading(false);

    } catch (error) {
      console.error("Error generating the image:", error);
      alert(
        "Failed to generate the image. Check the console for more details."
      );
    }
  }






  async editImageService(){
    this.service.getImageById("9").subscribe({
      next: (image) => {
        this.compressImage
          .compressFile(<string>image.link, -1, 100, 50) // 50% ratio, 50% quality
          .then(compressedImage => {
            this.generatedImage = compressedImage;
          })
      }
    })
    return;


    this.setIsLoading(true);

    console.log("PASSO: " +this.forest);
    console.log("PASSO: " +this.forestMask);

    try {

      const response = await this.openai.images.edit({
        model: "dall-e-2",
        image: this.forest,
        mask: this.forestMask,
        prompt: "a forest with a gorilla",
        n: 1,
        size: "512x512",
      });
      const responseData = response.data[0].url;
      console.log("Response from OpenAI:", responseData);

      this.selectedImage = undefined;
      this.generatedImage = responseData;
      this.setIsLoading(false);

    } catch (error) {
      console.error("Error generating the image:", error);
      alert(
        "Failed to generate the image. Check the console for more details."
      );
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

  fileInputChange1(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.forest = files[0];
      console.log(this.forest);
      console.log(this.forest.size / (1024 * 1024));
      this.generatedImage = undefined;
    }
  }

  fileInputChange2(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.forestMask = files[0];
      console.log(this.forestMask);
      console.log(this.forestMask.size / (1024 * 1024));
      this.generatedImage = undefined;

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



    /*
    const canvasElement = document.getElementById("myCanvas") as HTMLCanvasElement;
    const rect = canvasElement.getBoundingClientRect();
    this.offsetX = rect.left;
    this.offsetY = rect.top;

    // Aggiungi eventi per il canvas
    canvasElement.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    canvasElement.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    canvasElement.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    canvasElement.addEventListener('mouseout', (e) => this.handleMouseOut(e));

     */
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
