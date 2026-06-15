// Message storage and management
let messagesArray = [];
const MESSAGES_STORAGE_KEY = 'gc_messages';
const SAVED_CHATS_STORAGE_KEY = 'gc_saved_chats';
const TUTORIAL_SEEN_STORAGE_KEY = 'gc_tutorial_seen';

function isValidMessageObject(message) {
  return message
    && typeof message === 'object'
    && typeof message.id === 'string'
    && typeof message.type === 'string'
    && typeof message.sender === 'string'
    && typeof message.receiver === 'string'
    && typeof message.text === 'string'
    && typeof message.isSender === 'boolean'
    && typeof message.createdAt === 'string'
    && Object.prototype.hasOwnProperty.call(message, 'editedAt');
}

function isValidMessageArray(messages) {
  return Array.isArray(messages) && messages.every(isValidMessageObject);
}

function setMessages(nextMessages, shouldPersist = true) {
  messagesArray = Array.isArray(nextMessages) ? nextMessages : [];
  if (shouldPersist) {
    saveMessages();
  }
  return messagesArray;
}

export function initMessages() {
  const saved = localStorage.getItem(MESSAGES_STORAGE_KEY);
  if (!saved) return [];
  
  try {
    const parsed = JSON.parse(saved);
    messagesArray = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse messages from localStorage:', error);
    // Backup corrupted data
    localStorage.setItem('gc_messages_backup', saved);
    localStorage.removeItem(MESSAGES_STORAGE_KEY);
    messagesArray = [];
  }
  return messagesArray;
}

export function addMessage(messageObj) {
  // messageObj: { type, sender, receiver, text/action, createdAt }
  messagesArray.push(messageObj);
  saveMessages();
  return messageObj;
}

export function deleteMessage(messageId) {
  messagesArray = messagesArray.filter(msg => msg.id !== messageId);
  saveMessages();
}

export function editMessage(messageId, newText) {
  const msg = messagesArray.find(msg => msg.id === messageId);
  if (msg) {
    msg.text = newText;
    msg.editedAt = new Date().toISOString();
    saveMessages();
  }
}

function saveMessages() {
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messagesArray));
}

export function moveMessageUp(messageId) {
  const index = messagesArray.findIndex(msg => msg.id === messageId);
  if (index > 0) {
    const temp = messagesArray[index - 1];
    messagesArray[index - 1] = messagesArray[index];
    messagesArray[index] = temp;
    saveMessages();
  }
}

export function moveMessageDown(messageId) {
  const index = messagesArray.findIndex(msg => msg.id === messageId);
  if (index >= 0 && index < messagesArray.length - 1) {
    const temp = messagesArray[index + 1];
    messagesArray[index + 1] = messagesArray[index];
    messagesArray[index] = temp;
    saveMessages();
  }
}

export function switchMessageSender(messageId) {
  const msg = messagesArray.find(msg => msg.id === messageId);
  if (msg) {
    msg.isSender = !msg.isSender;
    saveMessages();
  }
}

export function updateMessageCharacter(messageId, isSenderTarget, newName, newImage) {
  const msg = messagesArray.find(msg => msg.id === messageId);
  if (msg) {
    if (isSenderTarget) {
      msg.sender = newName;
      msg.senderImage = newImage;
    } else {
      msg.receiver = newName;
      msg.receiverImage = newImage;
    }
    saveMessages();
  }
}

export function getMessages() {
  return messagesArray;
}

export function clearMessages() {
  messagesArray = [];
  saveMessages();
}

export function generateUUID() {
  return 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// --- SAVED CHATS ---
export function saveCurrentChat(chatName) {
  const savedChats = getSavedChats();
  savedChats[chatName] = {
    date: new Date().toISOString(),
    messages: JSON.parse(JSON.stringify(messagesArray)) // Deep copy
  };
  localStorage.setItem(SAVED_CHATS_STORAGE_KEY, JSON.stringify(savedChats));
}

export function loadChat(chatName) {
  const savedChats = getSavedChats();
  if (savedChats[chatName]) {
    setMessages(savedChats[chatName].messages || [], true);
    return true;
  }
  return false;
}

export function deleteSavedChat(chatName) {
  const savedChats = getSavedChats();
  if (savedChats[chatName]) {
    delete savedChats[chatName];
    localStorage.setItem(SAVED_CHATS_STORAGE_KEY, JSON.stringify(savedChats));
  }
}

export function getSavedChats() {
  const data = localStorage.getItem(SAVED_CHATS_STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse saved chats");
      return {};
    }
  }
  return {};
}

export function replaceMessages(nextMessages) {
  if (!Array.isArray(nextMessages)) {
    return false;
  }
  setMessages(nextMessages, true);
  return true;
}

export function getTutorialSeenFlag() {
  return localStorage.getItem(TUTORIAL_SEEN_STORAGE_KEY) === 'true';
}

export function markTutorialSeen() {
  localStorage.setItem(TUTORIAL_SEEN_STORAGE_KEY, 'true');
}

export function shouldAutoLoadTutorial() {
  if (getTutorialSeenFlag()) return false;
  const hasCurrentMessages = Array.isArray(messagesArray) && messagesArray.length > 0;
  const hasSavedChats = Object.keys(getSavedChats()).length > 0;
  return !hasCurrentMessages && !hasSavedChats;
}

export async function loadTutorialChat() {
  try {
    const response = await fetch('./src/data/tutorial-chat.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`Failed to load tutorial chat (${response.status})`);
    }

    const parsed = await response.json();
    if (!isValidMessageArray(parsed)) {
      throw new Error('Tutorial chat JSON does not match the expected message format');
    }

    setMessages(parsed, true);
    return true;
  } catch (error) {
    console.error('Failed to load tutorial chat:', error);
    return false;
  }
}
