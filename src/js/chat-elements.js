/* GLOBAL VARIABLE CLASS */

export const ChatMainElements = {
  input: document.getElementById("chat-input"),
  sendBtn: document.getElementById("send"),
  sendSwitch: document.getElementById("switch"),
  toggleInputMenu: document.getElementById("toggleInputMenu"),
  chatName: document.getElementById("chat-name"),
  settings: document.getElementById("settings")
};

// this one is for floating window receiver/sender selector
export const ChatNameElements = {
  tabButtons: document.querySelectorAll('.tab-button'),
  tabContents: document.querySelectorAll('.tab-content')
};

export const inputSection = {
  lower: document.getElementById("chatInputLower"),
  upper: document.getElementById("chatInputUpper")
}

// grouping all close buttons
export const CloseButtons = {
  senderReceiver: document.getElementById("closeReceiverSender"),
  settingsCredits: document.getElementById("closeSettings")
}