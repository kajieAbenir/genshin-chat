import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-floating-window',
  standalone: true,
  templateUrl: './floating-window.component.html',
  styleUrls: ['./floating-window.component.scss'],
})
export class FloatingWindowComponent {
  @Input() isVisible = false;
  @Output() closed = new EventEmitter<void>();

  close(): void {
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('floating-overlay')) {
      this.close();
    }
  }
}
