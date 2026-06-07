/* GLOBAL VARIABLE CLASS */

export const ChatMainElements = {
  get input() {
    return document.getElementById("chat-input");
  },
  get sendBtn() {
    return document.getElementById("send");
  },
  get sendSwitch() {
    return document.getElementById("switch");
  },
  get msgTypeChecked() {
    return document.querySelector('input[name="msgType"]:checked');
  },
  get toggleInputMenu() {
    return document.getElementById("toggleInputBtn"); // Changed to the button inside toggleInputMenu
  },
  get chatName() {
    return document.getElementById("chat-name");
  },
  get settings() {
    return document.getElementById("settings");
  }

  // previously, these were:

  // input: document.getElementById("chat-input"),
  // sendBtn: document.getElementById("send"),
  // sendSwitch: document.getElementById("switch"),
  // toggleInputMenu: document.getElementById("toggleInputBtn")
  // chatName: document.getElementById("chat-name"),
  // settings: document.getElementById("settings")
};

// this one is for floating window receiver/sender selector
export const ChatNameElements = {
  get receiverNameSpan() { return document.getElementById("receiver-name"); },
  get senderNameSpan() { return document.getElementById("sender-name"); },
  get receiverListDiv() { return document.getElementById("receiver-list"); },
  get senderListDiv() { return document.getElementById("sender-list"); },
  get recvSearchInput() { return document.getElementById("recv-search-input"); },
  get sendSearchInput() { return document.getElementById("send-search-input"); },
  // Scoped tab buttons for receiver/sender window only
  get receiverSenderTabButtons() {
    const window = document.getElementById("floatingReceiverSenderWindow");
    return window ? window.querySelectorAll('.tab-button') : [];
  },
  get receiverSenderTabContents() {
    const window = document.getElementById("floatingReceiverSenderWindow");
    return window ? window.querySelectorAll('.tab-content') : [];
  },
  // Scoped tab buttons for settings/credits window only
  get settingsTabButtons() {
    const window = document.getElementById("floatingSettingsWindow");
    return window ? window.querySelectorAll('.tab-button') : [];
  },
  get settingsTabContents() {
    const window = document.getElementById("floatingSettingsWindow");
    return window ? window.querySelectorAll('.tab-content') : [];
  }
};

export const CloseButtons = {
  get senderReceiver() { return document.getElementById("closeReceiverSender"); },
  get settingsCredits() { return document.getElementById("closeSettings"); } 
};

export const inputSection = {
  get lower() {
    return document.getElementById("chatInputLower");
  },
  get upper() {
    return document.getElementById("chatInputUpper");
  }
};

export const CustomCharElements = {
  get receiverName() { return document.getElementById("custom-receiver-name"); },
  get receiverImg() { return document.getElementById("custom-receiver-img"); },
  get applyReceiver() { return document.getElementById("apply-custom-receiver"); },
  get senderName() { return document.getElementById("custom-sender-name"); },
  get senderImg() { return document.getElementById("custom-sender-img"); },
  get applySender() { return document.getElementById("apply-custom-sender"); }
};

export const SettingsElements = {
  get clearChatBtn() { return document.getElementById('clearChatBtn'); },
  get exportChatBtn() { return document.getElementById('exportChatBtn'); },
  get customBgUpload() { return document.getElementById('custom-bg-upload'); },
  get clearCustomBgBtn() { return document.getElementById('clear-custom-bg'); }
};

export const BackgroundElements = {
  get bgPicElement() { return document.getElementById('background-pic'); },
  get currentBgLabel() { return document.getElementById('currentBgLabel'); },
  get prevBgBtn() { return document.getElementById('prevBgBtn'); },
  get nextBgBtn() { return document.getElementById('nextBgBtn'); }
};

export const UIScalingElements = {
  get decreaseFontBtn() { return document.getElementById('decreaseFontBtn'); },
  get increaseFontBtn() { return document.getElementById('increaseFontBtn'); },
  get fontScaleLabel() { return document.getElementById('fontScaleLabel'); }
};

export const ChatSavingElements = {
  get saveChatBtn() { return document.getElementById('save-chat-btn'); },
  get saveChatNameInput() { return document.getElementById('save-chat-name'); },
  get savedChatsList() { return document.getElementById('saved-chats-list'); }
};