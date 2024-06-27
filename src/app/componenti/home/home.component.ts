import {
  AfterViewInit,
  Component,
  ElementRef,
} from '@angular/core';
import OpenAI from "openai";
import {ServiceService} from "../../Service/service";
import { environment } from '../../../../config';
import {ImageService} from "../../Service/imageService";
import {Chat} from "../../Model/Chat";
import {AuthService} from "../../auth/auth.service";





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit{

  private resizeObserver: ResizeObserver | null = null;

  ngAfterViewInit() {
    this.selectedImage = this.imageService.getSelectedImage();
    this.generatedImage = this.imageService.getGeneratedImage();

    const targetElement = this.elementRef.nativeElement.querySelector('.sidebar');

    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.contentRect.height !== entry.contentRect.width) {
          console.log('Altezza dell\'elemento è cambiata:', entry.contentRect.height);
          this.updateChatMaxHeight();
        }
      }
    });

    this.resizeObserver.observe(targetElement);


    this.token = this.auth.token;
    //Load chat
    this.updateChat();
  }

  apiKey = environment.apiKey;


  private openai = new OpenAI({
    apiKey: this.apiKey,
    dangerouslyAllowBrowser: true
  })


  constructor(private service:ServiceService, private imageService:ImageService, private elementRef: ElementRef, private auth:AuthService) {
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
  chats : Chat[] = [];
  showDeletePopup: boolean = false;
  chatToDelete: Chat | undefined;
  token: string | null = null;





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


  async callToGenerateOpenAi() {
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
      this.imageService.generateRequest(responseData, this.inputPrompt);
      this.saveGenerated();


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
    this.setIsLoading(true);

    console.log("PASSO: " + image);
    console.log("PASSO: " + mask);

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
      this.imageService.generateRequest(responseData, this.inputPrompt);
      this.saveGenerated();

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


  handleSubmit() {
    if(this.inputPrompt == ""){
      alert("You must provide a prompt");
      return;
    }
    this.generatedImage = null;
    this.selectedImage = null;
    if (!this.editImageValue){
      this.callToGenerateOpenAi()
    }else{
      let image = this.imageService.getImageForApiEditRequest();
      let mask = this.imageService.getMask();
      this.imageService.resetImage();
      this.callToEditOpenAi(image, mask);
      this.editImageValue = this.imageService.editImageChange();
    }
  }







  fileInputChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedImage = URL.createObjectURL(files[0]);
      console.log(this.selectedImage);
      this.generatedImage = undefined;
      this.imageService.setSelectedImage(files[0]);
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
    window.location.reload();
  }

  saveImage(): void {
    this.save(this.imageService.getImageForDownload());
  }

  save(image: any){
    if(image == null) return
    const link = document.createElement('a');
    const url = URL.createObjectURL(image);
    link.href = url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  saveGenerated() {
    const imageData = { link: this.generatedImage, chatTitle: this.inputPrompt, token: this.token };
    this.service.saveImage(imageData).subscribe(
      response => {
        console.log('Immagine salvata con successo:', response);
        this.updateChat();
      },
      error => {
        console.error('Errore durante il salvataggio dell\'immagine:', error);
      }
    );
  }






  editImage() {
    this.editImageValue = this.imageService.editImageChange();
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
      const sidebarHeight = sidebar.offsetHeight;
      document.documentElement.style.setProperty('--chat-max-height', `${sidebarHeight - 114}px`);
    } else {
      console.error('Elemento .home non trovato.');
    }
  }


  onChatClick(chat: Chat) {
    let imgFile = this.imageService.convertPngStringToFile(chat.imageData, chat.title);
    this.imageService.setSelectedImage(imgFile);
    this.generatedImage = null;
    this.selectedImage = URL.createObjectURL(imgFile);
  }

  onDeleteClick(chat: Chat, event: Event){
    event.stopPropagation()
    this.showDeletePopup = true;
    this.chatToDelete = chat
    console.log(chat)
  }

  deleteChat() {
    this.showDeletePopup = false;
    if(this.chatToDelete){
      this.service.deleteChat(this.chatToDelete).subscribe({
        next: () => {
          window.location.reload()
        }
      });
    }
  }

  closePopup() {
    this.showDeletePopup = false;
  }

  updateChat(){
    if(this.token){
      this.imageService.getChatHistory().subscribe({
        next: (chat) => {
          this.chats = chat;
        }
      });
    }
  }



}
