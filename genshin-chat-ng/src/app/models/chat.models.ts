export interface Character {
  name: string;
  region: string;
  hex1: string;
  hex2: string;
}

export interface CharacterData {
  characters: {
    [region: string]: {
      [name: string]: {
        hex_1: string;
        hex_2: string;
      };
    };
  };
  bg_lookup: {
    [region: string]: {
      [key: string]: string;
    };
  };
}

export interface ChatMessage {
  id: number;
  text: string;
  isSender: boolean;
  senderName: string;
  timestamp: Date;
}
