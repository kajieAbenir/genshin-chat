import { Injectable, signal, computed } from '@angular/core';
import { Character, ChatMessage } from '../models/chat.models';

@Injectable({
  providedIn: 'root',
})
export class ChatStateService {
  /** Currently selected receiver character */
  readonly receiver = signal<Character | null>(null);

  /** Currently selected sender character */
  readonly sender = signal<Character | null>(null);

  /** Whether input is in "sender" mode (true) or "receiver" mode (false) */
  readonly isSenderMode = signal<boolean>(false);

  /** All chat messages */
  readonly messages = signal<ChatMessage[]>([]);

  /** Auto-incrementing message ID */
  private nextId = 1;

  /** Whether the input menu is visible */
  readonly inputMenuVisible = signal<boolean>(true);

  /** Chat header display name */
  readonly chatName = computed(() => {
    const recv = this.receiver();
    return recv ? recv.name : 'Chat';
  });

  /** Current active character name (based on toggle) */
  readonly activeCharacterName = computed(() => {
    return this.isSenderMode() ? this.sender()?.name ?? 'Sender' : this.receiver()?.name ?? 'Receiver';
  });

  /** Add a new message */
  addMessage(text: string): void {
    if (!text || text.trim() === '') return;

    const message: ChatMessage = {
      id: this.nextId++,
      text: text.trim(),
      isSender: this.isSenderMode(),
      senderName: this.activeCharacterName(),
      timestamp: new Date(),
    };

    this.messages.update((msgs) => [...msgs, message]);
  }

  /** Toggle between sender and receiver mode */
  toggleMode(): void {
    this.isSenderMode.update((v) => !v);
  }

  /** Toggle input menu visibility */
  toggleInputMenu(): void {
    this.inputMenuVisible.update((v) => !v);
  }

  /** Set receiver character */
  setReceiver(character: Character): void {
    this.receiver.set(character);
  }

  /** Set sender character */
  setSender(character: Character): void {
    this.sender.set(character);
  }

  /** Clear all messages */
  clearMessages(): void {
    this.messages.set([]);
    this.nextId = 1;
  }
}
