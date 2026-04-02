import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatStateService } from '../../services/chat-state.service';
import { ChatMessageComponent } from '../chat-message/chat-message.component';
import { FloatingWindowComponent } from '../floating-window/floating-window.component';
import { CharacterSelectorComponent } from '../character-selector/character-selector.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [
    FormsModule,
    ChatMessageComponent,
    FloatingWindowComponent,
    CharacterSelectorComponent,
    SettingsComponent,
  ],
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.scss'],
})
export class ChatContainerComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  inputText = '';
  showCharSelector = signal(false);
  showSettings = signal(false);

  private shouldScroll = false;

  constructor(public chatState: ChatStateService) {}

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  sendMessage(): void {
    if (!this.inputText.trim()) return;
    this.chatState.addMessage(this.inputText);
    this.inputText = '';
    this.shouldScroll = true;
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.sendMessage();
    }
  }

  toggleInputMenu(): void {
    this.chatState.toggleInputMenu();
  }

  openCharSelector(): void {
    this.showCharSelector.set(true);
  }

  closeCharSelector(): void {
    this.showCharSelector.set(false);
  }

  openSettings(): void {
    this.showSettings.set(true);
  }

  closeSettings(): void {
    this.showSettings.set(false);
  }

  private scrollToBottom(): void {
    try {
      const el = this.messagesContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch (err) {}
  }
}
