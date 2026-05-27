/* GLOBAL VARIABLE CLASS */

export const ChatMainElements = {
  input: document.getElementById("chat-input"),
  sendBtn: document.getElementById("send"),
  sendSwitch: document.getElementById("switch"),
  toggleInputMenu: document.getElementById("toggleInputBtn"), // Changed to the button inside toggleInputMenu
  chatName: document.getElementById("chat-name"),
  settings: document.getElementById("settings")
};

// this one is for floating window receiver/sender selector
// Added window.ChatNameElements to make it globally accessible for helper-functions.js if needed, though direct import is preferred.
export const ChatNameElements = {
  receiverNameSpan: document.getElementById("receiver-name"),
  senderNameSpan: document.getElementById("sender-name"),
  receiverListDiv: document.getElementById("receiver-list"),
  senderListDiv: document.getElementById("sender-list"),
  recvSearchInput: document.getElementById("recv-search-input"),
  sendSearchInput: document.getElementById("send-search-input"),
  tabButtons: document.querySelectorAll('.tab-button'),
  tabContents: document.querySelectorAll('.tab-content')
};
window.ChatNameElements = ChatNameElements; // Expose globally for easier debugging if needed

export const inputSection = {
  lower: document.getElementById("chatInputLower"),
  upper: document.getElementById("chatInputUpper")
}

// grouping all close buttons
export const CloseButtons = {
  senderReceiver: document.getElementById("closeReceiverSender"),
  settingsCredits: document.getElementById("closeSettings")
}