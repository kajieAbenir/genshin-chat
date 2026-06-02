import { deleteMessage, editMessage, getMessages } from './message-manager.js';
import { disableElement, enableElement } from './app-style.js';
import { ChatMainElements } from './chat-elements.js';

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
  messageElement.classList.add("chat-message", msg.isSender ? "sender" : "receiver");
  messageElement.setAttribute('data-message-id', msg.id);

  if (msg.type === 'action') {
    // Action line rendering
    const actionLine = document.createElement("div");
    actionLine.classList.add("action-line");
    actionLine.innerHTML = `
      <div class="action-content">
        <span class="action-text">${escapeHtml(msg.text)}</span>
      </div>
      <div class="message-controls">
        <button class="control-btn edit-btn" title="Edit" type="button">✏️</button>
        <button class="control-btn delete-btn" title="Delete" type="button">🗑️</button>
      </div>
    `;
    
    // Attach event listeners
    attachControlListeners(actionLine, msg);
    messageElement.appendChild(actionLine);
    
  } else {
    // Regular text message rendering
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

    // Message wrapper for hover controls
    const messageWrapper = document.createElement("div");
    messageWrapper.classList.add("message-wrapper");
    
    // Build bubble content with edit indicator
    const bubbleContent = document.createElement("div");
    bubbleContent.classList.add("bubble-content");
    bubbleContent.innerHTML = `
      <span>${escapeHtml(msg.text)}</span>
    `;
    
    bubbleElement.appendChild(bubbleContent);
    
    // Controls menu
    const controlsDiv = document.createElement("div");
    controlsDiv.classList.add("message-controls");
    controlsDiv.innerHTML = `
      <button class="control-btn edit-btn" title="Edit" type="button">✏️</button>
      <button class="control-btn delete-btn" title="Delete" type="button">🗑️</button>
    `;
    
    messageWrapper.appendChild(bubbleElement);
    messageWrapper.appendChild(controlsDiv);
    
    if (msg.isSender) {
      messageElement.appendChild(messageWrapper);
      messageElement.appendChild(imageElement);
    } else {
      messageElement.appendChild(imageElement);
      messageElement.appendChild(messageWrapper);
    }
    
    attachControlListeners(messageWrapper, msg);
  }

  return messageElement;
}

function attachControlListeners(element, msg) {
  const editBtn = element.querySelector('.edit-btn');
  const deleteBtn = element.querySelector('.delete-btn');

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      const preview = msg.text.substring(0, 30) + (msg.text.length > 30 ? '...' : '');
      if (confirm(`Delete message "${preview}"?`)) {
        deleteMessage(msg.id);
        renderMessages();
      }
    });
  }

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      const newText = prompt('Edit message:', msg.text);
      if (newText !== null && newText.trim()) {
        editMessage(msg.id, newText.trim());
        renderMessages();
      }
    });
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
