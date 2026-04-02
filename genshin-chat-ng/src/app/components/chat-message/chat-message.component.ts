import { Component, Input } from '@angular/core';
import { ChatMessage } from '../../models/chat.models';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss'],
})
export class ChatMessageComponent {
  @Input({ required: true }) message!: ChatMessage;
}
