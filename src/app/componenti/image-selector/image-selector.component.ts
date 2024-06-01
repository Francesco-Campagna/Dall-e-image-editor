import { Component } from '@angular/core';

@Component({
  selector: 'app-image-selector',
  templateUrl: './image-selector.component.html',
  styleUrls: ['./image-selector.component.css']
})
export class ImageSelectorComponent {

  isSelecting = false;
  selectionStyles = {};
  startX = 0;
  startY = 0;
  currentX = 0;
  currentY = 0;
  selections: any[] = [];
  showPopup = false;
  isEndSelection = false;

  startSelection(event: MouseEvent) {
    if(this.selections.length != 0) return;
    event.preventDefault();
    this.isSelecting = true;
    this.isEndSelection = false;
    this.startX = event.offsetX;
    this.startY = event.offsetY;
    this.currentX = this.startX;
    this.currentY = this.startY;
    this.updateSelectionStyles();
  }

  drawSelection(event: MouseEvent) {
    if (!this.isSelecting) return;
    this.currentX = event.offsetX;
    this.currentY = event.offsetY;
    this.updateSelectionStyles();
  }

  endSelection() {
    if (!this.isSelecting) return;
    this.isEndSelection = true;
    this.isSelecting = false;
    this.selections.push({ ...this.selectionStyles });
    this.selectionStyles = {};
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.showDeletePopup();
  }

  updateSelectionStyles() {
    const width = this.currentX - this.startX;
    const height = this.currentY - this.startY;
    this.selectionStyles = {
      left: `${Math.min(this.startX, this.currentX)}px`,
      top: `${Math.min(this.startY, this.currentY)}px`,
      width: `${Math.abs(width)}px`,
      height: `${Math.abs(height)}px`
    };
  }

  showDeletePopup() {
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.printCoordinates();
  }

  deleteSelection() {
      this.selections = [];
      this.closePopup();
  }

  printCoordinates(){
    console.log(this.selections);
  }

}
