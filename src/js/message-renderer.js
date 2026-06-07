import { deleteMessage, editMessage, getMessages, moveMessageUp, moveMessageDown, switchMessageSender, updateMessageCharacter } from './message-manager.js';
import { selectedSender, selectedReceiver } from './main-script.js';

export function renderMessages() {
  const container = document.getElementById("chat-messages");
  if (!container) return;
  
  container.innerHTML = ''; // Clear container

  const messages = getMessages();
  
  messages.forEach(msg => {
    const messageElement = createMessageElement(msg);
    container.appendChild(messageElement);
  });
  
  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

function createMessageElement(msg) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");
  messageElement.setAttribute('data-message-id', msg.id);

  if (msg.type === 'action') {
    messageElement.classList.add('action-line');
    
    const actionContent = document.createElement("div");
    actionContent.classList.add("action-content");
    const actionText = document.createElement("span");
    actionText.classList.add("action-text");
    actionText.textContent = msg.text; 
    actionContent.appendChild(actionText);

    messageElement.appendChild(actionContent);
    attachActionMenu(messageElement, msg);
    
  } else if (msg.type === 'timestamp') {
    messageElement.classList.add('timestamp-line');
    
    const timeText = document.createElement("span");
    timeText.textContent = msg.text;
    messageElement.appendChild(timeText);

    attachActionMenu(messageElement, msg);

  } else {
    // Regular text message
    messageElement.classList.add(msg.isSender ? "sender" : "receiver");
    
    const bubbleElement = document.createElement("div");
    bubbleElement.classList.add("chat-bubble");
    
    const imageElement = document.createElement('img');
    imageElement.classList.add('chat-image');
    imageElement.src = msg.isSender ? msg.senderImage : msg.receiverImage;
    imageElement.alt = msg.isSender ? msg.sender : msg.receiver;
    
    imageElement.onerror = () => {
      imageElement.src = './src/char-img/default.png';
      imageElement.onerror = null;
    };

    const messageWrapper = document.createElement("div");
    messageWrapper.classList.add("message-wrapper");
    
    const messageName = document.createElement("div");
    messageName.classList.add("message-name");
    messageName.textContent = msg.isSender ? msg.sender : msg.receiver; 
    
    const bubbleRow = document.createElement("div");
    bubbleRow.classList.add("bubble-row");

    const bubbleContent = document.createElement("div");
    bubbleContent.classList.add("bubble-content");
    
    const textSpan = document.createElement("span");
    textSpan.textContent = msg.text;
    bubbleContent.appendChild(textSpan);
    
    bubbleElement.appendChild(bubbleContent);
    bubbleRow.appendChild(bubbleElement);
    
    messageWrapper.appendChild(messageName);
    messageWrapper.appendChild(bubbleRow);
    
    if (msg.isSender) {
      messageElement.appendChild(messageWrapper);
      messageElement.appendChild(imageElement);
    } else {
      messageElement.appendChild(imageElement);
      messageElement.appendChild(messageWrapper);
    }
    
    attachActionMenu(messageElement, msg);
  }

  return messageElement;
}

function attachActionMenu(element, msg) {
  // Create an action menu container
  const actionMenu = document.createElement("div");
  actionMenu.classList.add("action-menu", "hidden");
  
  // Style it slightly directly via CSS class if possible, but structure here:
  actionMenu.innerHTML = `
    <button class="action-btn change-char-btn" type="button" title="Change Character">👥</button>
    <button class="action-btn up-btn" type="button" title="Move Up">⬆️</button>
    <button class="action-btn down-btn" type="button" title="Move Down">⬇️</button>
    <button class="action-btn switch-btn" type="button" title="Switch Sender/Receiver">🔄</button>
    <button class="action-btn edit-btn" type="button" title="Edit text">✏️</button>
    <button class="action-btn delete-btn" type="button" title="Delete">🗑️</button>
  `;

  element.appendChild(actionMenu);

  // Toggle menu on click
  element.addEventListener('click', (e) => {
    // Prevent toggling if a button inside the menu was clicked
    if (e.target.closest('.action-btn')) return;
    
    // Hide other open menus
    document.querySelectorAll('.action-menu:not(.hidden)').forEach(menu => {
      if (menu !== actionMenu) menu.classList.add('hidden');
    });

    actionMenu.classList.toggle('hidden');
  });

  // Attach button events
  const btnChar = actionMenu.querySelector('.change-char-btn');
  const btnUp = actionMenu.querySelector('.up-btn');
  const btnDown = actionMenu.querySelector('.down-btn');
  const btnSwitch = actionMenu.querySelector('.switch-btn');
  const btnEdit = actionMenu.querySelector('.edit-btn');
  const btnDelete = actionMenu.querySelector('.delete-btn');

  if (msg.type !== 'text') {
    btnChar.classList.add('hidden');
    btnSwitch.classList.add('hidden');
  }

  btnChar.addEventListener('click', () => {
    const newChar = msg.isSender ? selectedSender : selectedReceiver;
    if (confirm(`Change character for this message to ${newChar.name}?`)) {
      updateMessageCharacter(msg.id, msg.isSender, newChar.name, newChar.image);
      renderMessages();
    }
  });

  btnUp.addEventListener('click', () => {
    moveMessageUp(msg.id);
    renderMessages();
  });

  btnDown.addEventListener('click', () => {
    moveMessageDown(msg.id);
    renderMessages();
  });

  btnSwitch.addEventListener('click', () => {
    switchMessageSender(msg.id);
    renderMessages();
  });

  btnEdit.addEventListener('click', () => {
    const newText = prompt('Edit message:', msg.text);
    if (newText !== null && newText.trim()) {
      editMessage(msg.id, newText.trim());
      renderMessages();
    }
  });

  btnDelete.addEventListener('click', () => {
    deleteMessage(msg.id);
    renderMessages();
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
