// Message storage and management
let messagesArray = [];

export function initMessages() {
  // Load from localStorage on startup
  const saved = localStorage.getItem('gc_messages');
  messagesArray = saved ? JSON.parse(saved) : [];
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