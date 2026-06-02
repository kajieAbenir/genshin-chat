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
  get actionModeToggle() {
    return document.getElementById("actionModeToggle");
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