import { Component, signal } from '@angular/core';
import { ChatStateService } from '../../services/chat-state.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  activeTab = signal<'settings' | 'credits'>('settings');

  constructor(public chatState: ChatStateService) {}

  setTab(tab: 'settings' | 'credits'): void {
    this.activeTab.set(tab);
  }

  clearChat(): void {
    this.chatState.clearMessages();
  }
}
