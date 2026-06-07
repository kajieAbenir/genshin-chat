// Message storage and management
let messagesArray = [];

export function initMessages() {
  const saved = localStorage.getItem('gc_messages');
  if (!saved) return [];
  
  try {
    const parsed = JSON.parse(saved);
    messagesArray = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse messages from localStorage:', error);
    // Backup corrupted data
    localStorage.setItem('gc_messages_backup', saved);
    localStorage.removeItem('gc_messages');
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
  localStorage.setItem('gc_messages', JSON.stringify(messagesArray));
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
  localStorage.setItem('gc_saved_chats', JSON.stringify(savedChats));
}

export function loadChat(chatName) {
  const savedChats = getSavedChats();
  if (savedChats[chatName]) {
    messagesArray = savedChats[chatName].messages || [];
    saveMessages();
    return true;
  }
  return false;
}

export function deleteSavedChat(chatName) {
  const savedChats = getSavedChats();
  if (savedChats[chatName]) {
    delete savedChats[chatName];
    localStorage.setItem('gc_saved_chats', JSON.stringify(savedChats));
  }
}

export function getSavedChats() {
  const data = localStorage.getItem('gc_saved_chats');
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