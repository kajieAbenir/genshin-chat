import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../services/character.service';
import { ChatStateService } from '../../services/chat-state.service';
import { Character } from '../../models/chat.models';

@Component({
  selector: 'app-character-selector',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './character-selector.component.html',
  styleUrls: ['./character-selector.component.scss'],
})
export class CharacterSelectorComponent implements OnInit {
  activeTab = signal<'receiver' | 'sender'>('receiver');
  searchQuery = signal<string>('');
  allCharacters = signal<Character[]>([]);

  filteredCharacters = computed(() => {
    return this.characterService.searchCharacters(
      this.allCharacters(),
      this.searchQuery()
    );
  });

  /** Group filtered characters by region */
  groupedCharacters = computed(() => {
    const chars = this.filteredCharacters();
    const groups: { [region: string]: Character[] } = {};
    for (const c of chars) {
      if (!groups[c.region]) {
        groups[c.region] = [];
      }
      groups[c.region].push(c);
    }
    return groups;
  });

  groupedRegions = computed(() => Object.keys(this.groupedCharacters()));

  selectedReceiverName = computed(() => this.chatState.receiver()?.name ?? 'None');
  selectedSenderName = computed(() => this.chatState.sender()?.name ?? 'None');

  constructor(
    private characterService: CharacterService,
    public chatState: ChatStateService
  ) {}

  ngOnInit(): void {
    this.characterService.getCharacterList().subscribe((chars) => {
      this.allCharacters.set(chars);
    });
  }

  setTab(tab: 'receiver' | 'sender'): void {
    this.activeTab.set(tab);
    this.searchQuery.set('');
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  selectCharacter(character: Character): void {
    if (this.activeTab() === 'receiver') {
      this.chatState.setReceiver(character);
    } else {
      this.chatState.setSender(character);
    }
  }

  isSelected(character: Character): boolean {
    if (this.activeTab() === 'receiver') {
      return this.chatState.receiver()?.name === character.name;
    }
    return this.chatState.sender()?.name === character.name;
  }
}
