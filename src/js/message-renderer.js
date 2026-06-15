import { deleteMessage, editMessage, getMessages, moveMessageUp, moveMessageDown, switchMessageSender, updateMessageCharacter } from './message-manager.js';
import { getReceiver, getSender } from './app-state.js';

export function renderMessages() {
  const container = document.getElementById("chat-messages");
  if (!container) return;

  container.innerHTML = '';

  const messages = getMessages();
  messages.forEach(msg => {
    const messageElement = createMessageElement(msg);
    container.appendChild(messageElement);
  });

  container.scrollTop = container.scrollHeight;
  ensureActionHandlers();
}

function createMessageElement(msg) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("chat-message");
  messageElement.setAttribute('data-message-id', msg.id);
  messageElement.style.position = 'relative';

  if (msg.type === 'action') {
    messageElement.classList.add('action-line');

    const actionContent = document.createElement("div");
    actionContent.classList.add("action-content");
    const actionText = document.createElement("span");
    actionText.classList.add("action-text");
    actionText.textContent = msg.text;
    actionText.contentEditable = "true";
    actionText.spellcheck = false;
    actionText.setAttribute('data-id', msg.id);
    actionText.dataset.editableType = 'action';
    actionContent.appendChild(actionText);

    messageElement.appendChild(actionContent);
    attachActionMenu(messageElement, msg);
    wireRevealTrigger(actionText, actionMenuToggleBehavior);
  } else if (msg.type === 'timestamp') {
    messageElement.classList.add('timestamp-line');

    const timeText = document.createElement("span");
    timeText.textContent = msg.text;
    timeText.contentEditable = "true";
    timeText.spellcheck = false;
    timeText.setAttribute('data-id', msg.id);
    timeText.dataset.editableType = 'timestamp';
    messageElement.appendChild(timeText);
    attachActionMenu(messageElement, msg);
    wireRevealTrigger(timeText, actionMenuToggleBehavior);
  } else {
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
    textSpan.contentEditable = "true";
    textSpan.spellcheck = false;
    textSpan.setAttribute('data-id', msg.id);
    textSpan.dataset.editableType = 'message';
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

    imageElement.setAttribute("role", "button");
    imageElement.setAttribute("tabindex", "0");
    imageElement.setAttribute("aria-label", "Show message actions");
    attachActionMenu(messageElement, msg);
  }

  return messageElement;
}

function attachActionMenu(element, msg) {
  const actionMenu = document.createElement("div");
  actionMenu.classList.add("action-menu", "hidden");

  const isTextMessage = msg.type === 'text';
  actionMenu.innerHTML = `
    ${isTextMessage ? '<button class="action-btn change-char-btn" type="button" title="Change Character" data-action="change-char">👥</button>' : ''}
    <button class="action-btn up-btn" type="button" title="Move Up" data-action="up">⬆️</button>
    <button class="action-btn down-btn" type="button" title="Move Down" data-action="down">⬇️</button>
    ${isTextMessage ? '<button class="action-btn switch-btn" type="button" title="Switch Sender/Receiver" data-action="switch">🔄</button>' : ''}
    <button class="action-btn delete-btn" type="button" title="Delete" data-action="delete">🗑️</button>
  `;

  element.appendChild(actionMenu);

  const toggleTarget = element.querySelector('.chat-image');
  if (toggleTarget) {
    toggleTarget.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleActionMenu(actionMenu);
    });
    toggleTarget.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleActionMenu(actionMenu);
      }
    });
  }
}

function toggleActionMenu(actionMenu) {
  document.querySelectorAll('.action-menu:not(.hidden)').forEach(menu => {
    if (menu !== actionMenu) menu.classList.add('hidden');
  });

  actionMenu.classList.toggle('hidden');
}

function wireRevealTrigger(target, toggleBehavior) {
  if (!target) return;
  target.setAttribute('role', 'button');
  target.setAttribute('tabindex', '0');
  target.setAttribute('aria-label', 'Show message actions');
  target.addEventListener('click', toggleBehavior);
  target.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleBehavior(e);
    }
  });
}

function actionMenuToggleBehavior(e) {
  const messageEl = e.currentTarget?.closest('.chat-message');
  if (!messageEl) return;
  const actionMenu = messageEl.querySelector('.action-menu');
  if (!actionMenu) return;
  toggleActionMenu(actionMenu);
}

let actionsInitialized = false;

function initMessageActionHandlers() {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.action-btn');
    if (!btn) return;

    e.stopPropagation();
    const action = btn.dataset.action;
    const messageEl = btn.closest('.chat-message');
    if (!messageEl) return;

    const msgId = messageEl.dataset.messageId;
    const isSender = messageEl.classList.contains('sender');
    const receiver = getReceiver();
    const sender = getSender();

    switch (action) {
      case 'change-char': {
        const newChar = isSender ? sender : receiver;
        if (confirm(`Change character for this message to ${newChar.name}?`)) {
          updateMessageCharacter(msgId, isSender, newChar.name, newChar.image);
          renderMessages();
        }
        break;
      }
      case 'up':
        moveMessageUp(msgId);
        renderMessages();
        break;
      case 'down':
        moveMessageDown(msgId);
        renderMessages();
        break;
      case 'switch':
        switchMessageSender(msgId);
        renderMessages();
        break;
      case 'delete':
        deleteMessage(msgId);
        renderMessages();
        break;
      default:
        break;
    }
  });
}

function ensureActionHandlers() {
  if (!actionsInitialized) {
    initMessageActionHandlers();
    actionsInitialized = true;
  }
}
