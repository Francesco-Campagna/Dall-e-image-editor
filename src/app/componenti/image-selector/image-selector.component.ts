import {Component, OnInit} from '@angular/core';
import {ImageService} from "../../Service/imageService";
import {Coordinates} from "../../Model/Coordinates";

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent implements OnInit{

  image: any = null;

  isSelecting = false;
  coordinates: Coordinates | undefined;
  startX = 0;
  startY = 0;
  currentX = 0;
  currentY = 0;
  selections: any[] = [];
  showPopup = false;
  isEndSelection = false;


  ngOnInit(): void {
    this.image = this.imageService.getImageForEdit();
    this.imageService.resetEditImageConfirmed();
  }

  constructor(private imageService:ImageService) {
  }


  startSelection(event: MouseEvent) {
    if(this.selections.length != 0) return;
    event.preventDefault();
    this.isSelecting = true;
    this.isEndSelection = false;
    this.startX = event.offsetX;
    this.startY = event.offsetY;
    this.currentX = this.startX;
    this.currentY = this.startY;
    this.updatecoordinates();
  }

  drawSelection(event: MouseEvent) {
    if (!this.isSelecting) return;
    this.currentX = event.offsetX;
    this.currentY = event.offsetY;
    this.updatecoordinates();
  }

  endSelection() {
    if (!this.isSelecting) return;
    this.isEndSelection = true;
    this.isSelecting = false;
    this.selections.push({ ...this.coordinates });
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.showDeletePopup();
  }

  updatecoordinates() {
    const width = this.currentX - this.startX;
    const height = this.currentY - this.startY;
    this.coordinates = {
      left: `${Math.min(this.startX, this.currentX)}px`,
      top: `${Math.min(this.startY, this.currentY)}px`,
      width: `${Math.abs(width)}px`,
      height: `${Math.abs(height)}px`
    };
  }

  resetCoordinates(){
    this.coordinates = undefined;
  }

  showDeletePopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.printCoordinates();
    if(this.selections.length > 0) {
      this.imageService.confirmSelection(this.coordinates);
    }
  }

  deleteSelection() {
    this.selections = [];
    this.resetCoordinates();
    this.closePopup();
  }

  printCoordinates(){
    console.log("coordinate: " +this.coordinates);
  }

}
