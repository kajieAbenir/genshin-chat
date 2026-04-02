import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay, retry } from 'rxjs';
import { Character, CharacterData } from '../models/chat.models';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private dataUrl = 'assets/char_info.json';
  private cache$: Observable<CharacterData> | null = null;

  constructor(private http: HttpClient) {}

  /** Fetch and cache the character data JSON */
  getCharacterData(): Observable<CharacterData> {
    if (!this.cache$) {
      this.cache$ = this.http
        .get<CharacterData>(this.dataUrl)
        .pipe(retry(3), shareReplay(1));
    }
    return this.cache$;
  }

  /** Flatten the nested JSON into a flat Character[] array */
  getCharacterList(): Observable<Character[]> {
    return this.getCharacterData().pipe(
      map((data) => {
        const characters: Character[] = [];
        for (const region of Object.keys(data.characters)) {
          const regionChars = data.characters[region];
          for (const name of Object.keys(regionChars)) {
            characters.push({
              name: name.replace(/_/g, ' '),
              region,
              hex1: regionChars[name].hex_1,
              hex2: regionChars[name].hex_2,
            });
          }
        }
        return characters;
      })
    );
  }

  /** Get a list of region names */
  getRegions(): Observable<string[]> {
    return this.getCharacterData().pipe(
      map((data) => Object.keys(data.characters))
    );
  }

  /** Search characters by name */
  searchCharacters(
    characters: Character[],
    query: string
  ): Character[] {
    if (!query || query.trim() === '') {
      return characters;
    }
    const lowerQuery = query.toLowerCase();
    return characters.filter((c) =>
      c.name.toLowerCase().includes(lowerQuery)
    );
  }
}
