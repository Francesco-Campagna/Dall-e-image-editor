import {Component, OnInit} from '@angular/core';
import {ServiceService} from "../../Service/service";
import {ImageService} from "../../Service/imageService";
import {Chat} from "../../Model/Chat";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{
  chat : Chat[] = [];

  constructor(private service: ServiceService, private imageService: ImageService) {
  }

  ngOnInit(): void {
    this.imageService.getChatHistory().subscribe({
      next: (chat) => {
        this.chat = chat;
      }
    });
  }



}
