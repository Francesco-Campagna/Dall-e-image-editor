import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() closeButtonText: string = 'Close';

  @Output() closed = new EventEmitter<void>();

  closePopup() {
    this.closed.emit();
  }
}
