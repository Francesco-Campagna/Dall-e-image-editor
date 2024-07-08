import {Component, EventEmitter, Output} from '@angular/core';
import {ServiceService} from "../../Service/service";
import {popup_message} from "../../popup_message";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  apiKey: string = '';
  // Variables for popup
  isPopupVisible = false;
  popupTitle = '';
  popupMessage = '';
  showPopup = false;

  constructor(private service: ServiceService) {
  }


  saveApiKey() {
    if (!this.showPopup){
      this.popupTitle = popup_message.change_apiKey.title;
      this.popupMessage = popup_message.change_apiKey.message;
      this.isPopupVisible = true;
      this.showPopup = true;
    } else {
      this.showPopup = false;
      this.service.saveApiKey(this.apiKey).subscribe({
        next:() => {
          console.log('API Key salvata:', this.apiKey);
        }
      })
      this.close.emit();
    }
  }

  cancel(){
    this.close.emit();
  }

  onPopupClosed() {
    this.isPopupVisible = false;
  }
}
