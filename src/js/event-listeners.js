import { ChatMainElements, ChatNameElements, inputSection, CustomCharElements, CloseButtons, SettingsElements, BackgroundElements, UIScalingElements, ChatSavingElements } from "./chat-elements.js";
import { hasInputValue, logError, debounce } from "./helper-functions.js";
import { disableElement, enableElement, showElement, hideElement, addActiveViaDataTab, removeActiveViaDataTab } from "./app-style.js";
import { addConversation, showCharList, setCustomCharacter } from "./main-script.js";
import { clearMessages, saveCurrentChat, loadChat, deleteSavedChat, getSavedChats, editMessage, getMessages, loadTutorialChat, markTutorialSeen } from "./message-manager.js";
import { renderMessages } from "./message-renderer.js";
import { onStateChange, getReceiver, getSender } from "./app-state.js";

/* EVENT LISTENERS */

document.addEventListener("DOMContentLoaded", () => {
  const CHAT_TITLE_STORAGE_KEY = 'gc_active_chat_title';
  const CHAT_TITLE_DEFAULT = 'Click to add chat title';

  function getChatTitleEl() {
    return document.getElementById('chat-title-text');
  }

  function setChatTitle(title) {
    const chatTitleText = getChatTitleEl();
    const saveChatInput = ChatSavingElements.saveChatNameInput;
    const normalizedTitle = title ? title.trim() : '';

    if (!chatTitleText) return;

    if (!normalizedTitle || normalizedTitle === CHAT_TITLE_DEFAULT) {
      chatTitleText.textContent = CHAT_TITLE_DEFAULT;
      if (saveChatInput) {
        saveChatInput.value = '';
      }
      localStorage.removeItem(CHAT_TITLE_STORAGE_KEY);
      return;
    }

    chatTitleText.textContent = normalizedTitle;
    if (saveChatInput) {
      saveChatInput.value = normalizedTitle;
    }
    localStorage.setItem(CHAT_TITLE_STORAGE_KEY, normalizedTitle);
  }

  function syncChatTitleFromStorage() {
    setChatTitle(localStorage.getItem(CHAT_TITLE_STORAGE_KEY) || CHAT_TITLE_DEFAULT);
  }

  function syncSavedChatTitle(chatName) {
    if (chatName) {
      setChatTitle(chatName);
    }
  }

  // 1. Enter Key Listener
  if (ChatMainElements.input) {
    ChatMainElements.input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        try {
          addConversation();
        } catch (error) {
          logError("Unable to add message.\n  >> ", error);
        }
      }
    });
  }

  // 2. Chat Input Change Listener
  if (ChatMainElements.input) {
    ChatMainElements.input.addEventListener("input", function () {
      if (hasInputValue() === false) {
        disableElement(ChatMainElements.sendBtn);
      } else {
        enableElement(ChatMainElements.sendBtn);
      }
    });
  }

  // 3. Chat Title Editing (replaces old "Chat Options" click-to-open-selector)
  const chatTitleText = getChatTitleEl();
  if (chatTitleText) {
    syncChatTitleFromStorage();

    chatTitleText.addEventListener('input', () => {
      const saveChatInput = ChatSavingElements.saveChatNameInput;
      if (saveChatInput) {
        const liveTitle = chatTitleText.textContent.trim();
        saveChatInput.value = liveTitle && liveTitle !== CHAT_TITLE_DEFAULT ? liveTitle : '';
      }
    });

    chatTitleText.addEventListener('focusout', () => {
      setChatTitle(chatTitleText.textContent);
    });

    chatTitleText.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        chatTitleText.blur();
      }
    });

    // Select all text on focus for easy replacement
    chatTitleText.addEventListener('focus', () => {
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(chatTitleText);
      sel.removeAllRanges();
      sel.addRange(range);
    });
  }

  // 4. Search Filter for Receiver List
  if (ChatNameElements.recvSearchInput) {
    const debouncedSearch = debounce((searchTerm) => {
      if (ChatNameElements.receiverListDiv) {
        showCharList(ChatNameElements.receiverListDiv.id, 'receiver', searchTerm);
      }
    }, 300);

    ChatNameElements.recvSearchInput.addEventListener('input', function() {
      debouncedSearch(this.value);
    });
  }

  // 5. Search Filter for Sender List
  if (ChatNameElements.sendSearchInput) {
    const debouncedSearch = debounce((searchTerm) => {
      if (ChatNameElements.senderListDiv) {
        showCharList(ChatNameElements.senderListDiv.id, 'sender', searchTerm);
      }
    }, 300);

    ChatNameElements.sendSearchInput.addEventListener('input', function() {
      debouncedSearch(this.value);
    });
  }

  // 6. Close Character Selection Window
  if (CloseButtons.senderReceiver) {
    CloseButtons.senderReceiver.addEventListener("click", function () {
      hideElement("floatingReceiverSenderWindow");
    });
  }

  // 7. Toggle Chat Input Layout Menus
  if (ChatMainElements.toggleInputMenu) {
    ChatMainElements.toggleInputMenu.addEventListener("click", function () {
      // Safely grab the upper and lower input rows from inputSection
      const lower = inputSection.lower;
      const upper = inputSection.upper;

      if (lower && upper) {
        // Toggle your utility '.hidden' class
        lower.classList.toggle("hidden");
        upper.classList.toggle("hidden");
        
        // Check if it is currently hidden based on the class list state
        const currentlyHidden = lower.classList.contains("hidden");
        
        // Update the button text directly using 'this' (the button that was clicked)
        this.textContent = currentlyHidden ? "Show" : "Hide";
        
      } else {
        console.warn("Could not find chat input rows to toggle.");
      }
    });
  }

  // 8. Add Message Click Action
  if (ChatMainElements.sendBtn) {
    ChatMainElements.sendBtn.addEventListener("click", function () {
      addConversation();
    });
  }

  // 9. Open Settings Window
  if (ChatMainElements.settings) {
    ChatMainElements.settings.addEventListener("click", function () {
      showElement("floatingSettingsWindow", "flex");
    });
  }

  // 10. Close Settings Window
  if (CloseButtons.settingsCredits) {
    CloseButtons.settingsCredits.addEventListener("click", function () {
      hideElement("floatingSettingsWindow", "flex");
    });
  }

  // 11. Tab Swapping Selection Interface - Receiver/Sender Window
  if (ChatNameElements.receiverSenderTabButtons) {
    ChatNameElements.receiverSenderTabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Clear active states only within this window
        ChatNameElements.receiverSenderTabButtons.forEach(btn => removeActiveViaDataTab(btn.dataset.tab));
        ChatNameElements.receiverSenderTabContents.forEach(content => content.classList.remove('active'));

        // Apply active class to selected elements
        addActiveViaDataTab(button.dataset.tab);
        const targetId = button.getAttribute('data-tab');
        document.getElementById(targetId)?.classList.add('active');
      });
    });
  }

  // 12. Tab Swapping Selection Interface - Settings/Credits Window
  if (ChatNameElements.settingsTabButtons) {
    ChatNameElements.settingsTabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Clear active states only within this window
        ChatNameElements.settingsTabButtons.forEach(btn => removeActiveViaDataTab(btn.dataset.tab));
        ChatNameElements.settingsTabContents.forEach(content => content.classList.remove('active'));

        // Apply active class to selected elements
        addActiveViaDataTab(button.dataset.tab);
        const targetId = button.getAttribute('data-tab');
        document.getElementById(targetId)?.classList.add('active');
      });
    });
  }

  // 13. Clear Chat Button
  if (SettingsElements.clearChatBtn) {
    SettingsElements.clearChatBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to clear all messages? This cannot be undone.')) {
        clearMessages();
        renderMessages();
        hideElement("floatingSettingsWindow");
      }
    });
  }

  if (SettingsElements.loadTutorialBtn) {
    SettingsElements.loadTutorialBtn.addEventListener('click', async function() {
      if (!confirm('Load the tutorial chat? This will replace your current conversation.')) {
        return;
      }

      const loaded = await loadTutorialChat();
      if (loaded) {
        markTutorialSeen();
        renderMessages();
        hideElement("floatingSettingsWindow");
      } else {
        alert('Unable to load the tutorial chat right now.');
      }
    });
  }

  // 14. Export Chat Button
  if (SettingsElements.exportChatBtn) {
    SettingsElements.exportChatBtn.addEventListener('click', function() {
      const chatMessages = document.getElementById('chat-messages');
      if (chatMessages && window.html2canvas) {
        // Hide scrollbar and expand height to capture full chat
        chatMessages.classList.add('export-mode');

        html2canvas(chatMessages, {
          backgroundColor: '#22283e',
          useCORS: true,
          scale: 2 // High-res export
        }).then(canvas => {
          // Restore styles
          chatMessages.classList.remove('export-mode');

          const link = document.createElement('a');
          link.download = 'genshin-chat-export.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        }).catch(err => {
          console.error('Error exporting chat:', err);
          chatMessages.classList.remove('export-mode');
        });
      } else {
        alert("Error: html2canvas is not loaded.");
      }
    });
  }

  function validateImageFile(file) {
    const MAX_SIZE = 2048 * 1024; // 2 MB limit
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Please upload a valid image (PNG, JPEG, or WebP)');
      return false;
    }
    if (file.size > MAX_SIZE) {
      alert('Image must be smaller than 2.00 MB');
      return false;
    }
    return true;
  }

  // 15. Custom Character Uploads
  if (CustomCharElements.applyReceiver) {
    CustomCharElements.applyReceiver.addEventListener('click', () => {
      const name = CustomCharElements.receiverName.value;
      const file = CustomCharElements.receiverImg.files[0];
      if (file && validateImageFile(file))  {
        const reader = new FileReader();
        reader.onload = (e) => setCustomCharacter('receiver', name, e.target.result);
        reader.readAsDataURL(file);
      } else {
        setCustomCharacter('receiver', name, null);
      }
      hideElement("floatingReceiverSenderWindow");
    });
  }

  if (CustomCharElements.applySender) {
    CustomCharElements.applySender.addEventListener('click', () => {
      const name = CustomCharElements.senderName.value;
      const file = CustomCharElements.senderImg.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setCustomCharacter('sender', name, e.target.result);
        reader.readAsDataURL(file);
      } else {
        setCustomCharacter('sender', name, null);
      }
      hideElement("floatingReceiverSenderWindow");
    });
  }

  // 16. Background Switcher Logic
  const bgList = [
    { name: "Default - Domain BG", path: "/src/bg-img/Party Setup Background_Domain_asddzr Cleaned.jpg" },
    { name: "Mondstadt BG", path: "/src/bg-img/Party Setup Background_Mondstadt_asddzr Cleaned.jpg" },
    { name: "Liyue BG", path: "/src/bg-img/Party Setup Background_Liyue_asddzr Cleaned.jpg" },
    { name: "Inazuma BG", path: "/src/bg-img/Party Setup Background_Inazuma_asddzr Cleaned.jpg" },
    { name: "Sumeru BG", path: "/src/bg-img/Party Setup Background_Sumeru_asddzr Cleaned.jpg" },
    { name: "Sumeru Desert", path: "/src/bg-img/Party Setup Background_Sumeru Desert_asddzr Cleaned.jpg" },
    { name: "Fontaine BG", path: "/src/bg-img/Party Setup Background_Fontaine_asddzr Cleaned.jpg" },
    { name: "Natlan BG", path: "/src/bg-img/Party Setup Background_Natlan_asddzr Cleaned.jpg" },
    { name: "Nod-Krai BG", path: "/src/bg-img/Party Setup Background_Nod-Krai_asddzr Cleaned.jpg" }
  ];

  let currentBgIndex = parseInt(localStorage.getItem('genshin-chat-bg-index')) || 0;

  function updateBackground() {
    if(currentBgIndex < 0) currentBgIndex = bgList.length - 1;
    if(currentBgIndex >= bgList.length) currentBgIndex = 0;
    
    if (BackgroundElements.bgPicElement && BackgroundElements.currentBgLabel) {
      document.documentElement.style.setProperty('--active-bg', `url('${bgList[currentBgIndex].path}')`);
      BackgroundElements.currentBgLabel.textContent = bgList[currentBgIndex].name;
      localStorage.setItem('genshin-chat-bg-index', currentBgIndex.toString());
    }
  }

  if (BackgroundElements.prevBgBtn && BackgroundElements.nextBgBtn) {
    BackgroundElements.prevBgBtn.addEventListener('click', () => {
      currentBgIndex--;
      updateBackground();
    });
    BackgroundElements.nextBgBtn.addEventListener('click', () => {
      currentBgIndex++;
      updateBackground();
    });
    // Init on load
    updateBackground();
  }

  // 17. UI Scaling Logic
  let currentUiScale = parseFloat(localStorage.getItem('genshin-chat-ui-scale')) || 1.0;

  function updateUiScale() {
    // Clamp between 0.7 and 1.5
    currentUiScale = Math.max(0.7, Math.min(1.5, currentUiScale));
    document.documentElement.style.setProperty('--ui-scale', currentUiScale.toString());
    if (UIScalingElements.fontScaleLabel) {
      UIScalingElements.fontScaleLabel.textContent = Math.round(currentUiScale * 100) + "%";
    }
    localStorage.setItem('genshin-chat-ui-scale', currentUiScale.toString());
  }

  if (UIScalingElements.decreaseFontBtn && UIScalingElements.increaseFontBtn) {
    UIScalingElements.decreaseFontBtn.addEventListener('click', () => {
      currentUiScale -= 0.1;
      currentUiScale = Math.round(currentUiScale * 10) / 10;
      updateUiScale();
    });
    UIScalingElements.increaseFontBtn.addEventListener('click', () => {
      currentUiScale += 0.1;
      currentUiScale = Math.round(currentUiScale * 10) / 10;
      updateUiScale();
    });
    updateUiScale();
  }

  // 18. Custom Background Upload
  function updateCustomBackground(dataUrl) {
    if (BackgroundElements.bgPicElement) {
      document.documentElement.style.setProperty('--active-bg', `url('${dataUrl}')`);
      if (BackgroundElements.currentBgLabel) BackgroundElements.currentBgLabel.textContent = "Custom Image";
    }
  }

  // Check if custom bg exists on load
  const savedCustomBg = localStorage.getItem('gc_custom_bg');
  if (savedCustomBg) {
    updateCustomBackground(savedCustomBg);
  }

  if (SettingsElements.customBgUpload) {
    SettingsElements.customBgUpload.addEventListener('change', function() {
      const file = this.files[0];
      if (file && validateImageFile(file)) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const dataUrl = e.target.result;
          localStorage.setItem('gc_custom_bg', dataUrl);
          updateCustomBackground(dataUrl);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (SettingsElements.clearCustomBgBtn) {
    SettingsElements.clearCustomBgBtn.addEventListener('click', () => {
      localStorage.removeItem('gc_custom_bg');
      if (SettingsElements.customBgUpload) SettingsElements.customBgUpload.value = '';
      updateBackground(); // revert to default list
    });
  }

  // 19. Saved Chats
  function renderSavedChats() {
    if (!ChatSavingElements.savedChatsList) return;
    ChatSavingElements.savedChatsList.innerHTML = '';
    const chats = getSavedChats();
    const chatNames = Object.keys(chats);

    if (chatNames.length === 0) {
      const emptySpan = document.createElement('span');
      emptySpan.textContent = 'No saved chats';
      emptySpan.classList.add('saved-chats-empty');
      ChatSavingElements.savedChatsList.appendChild(emptySpan);
      return;
    }

    chatNames.forEach(name => {
      const item = document.createElement('div');
      item.classList.add('saved-chat-item');
      
      const textSpan = document.createElement('span');
      textSpan.textContent = name;
      textSpan.classList.add('saved-chat-name');
      textSpan.addEventListener('click', () => {
        if (confirm(`Load chat "${name}"? Current unsaved progress will be lost.`)) {
          loadChat(name);
          syncSavedChatTitle(name);
          renderMessages();
          hideElement("floatingSettingsWindow");
        }
      });

      const delBtn = document.createElement('button');
      delBtn.textContent = 'X';
      delBtn.classList.add('saved-chat-del');
      delBtn.addEventListener('click', () => {
        if (confirm(`Delete saved chat "${name}"?`)) {
          deleteSavedChat(name);
          renderSavedChats();
        }
      });

      item.appendChild(textSpan);
      item.appendChild(delBtn);
      ChatSavingElements.savedChatsList.appendChild(item);
    });
  }

  if (ChatSavingElements.saveChatBtn && ChatSavingElements.saveChatNameInput) {
    ChatSavingElements.saveChatBtn.addEventListener('click', () => {
      const name = ChatSavingElements.saveChatNameInput.value.trim();
      if (name) {
        saveCurrentChat(name);
        syncSavedChatTitle(name);
        ChatSavingElements.saveChatNameInput.value = '';
        renderSavedChats();
      } else {
        alert("Please enter a name for the chat.");
      }
    });

    // Initial render of saved chats when settings is opened
    if (ChatMainElements.settings) {
      ChatMainElements.settings.addEventListener('click', () => {
        renderSavedChats();
      });
    }
  }

  // 15. Input Character Selector & Avatar Reactivity
  function updateInputAvatar() {
    const avatarImg = document.getElementById("inputCharAvatar");
    const selectorBtn = document.getElementById("inputCharSelector");
    if (!avatarImg || !selectorBtn) return;

    const isSender = ChatMainElements.sendSwitch && ChatMainElements.sendSwitch.checked;
    const activeChar = isSender ? getSender() : getReceiver();
    
    avatarImg.src = activeChar.image || './src/char-img/default.png';
    avatarImg.alt = activeChar.name || 'Active Character';
    
    avatarImg.onerror = () => {
      avatarImg.src = './src/char-img/default.png';
      avatarImg.onerror = null;
    };

    // Set custom styles/classes on wrapper button for frame styling
    if (isSender) {
      selectorBtn.classList.add('is-sender');
      selectorBtn.classList.remove('is-receiver');
    } else {
      selectorBtn.classList.add('is-receiver');
      selectorBtn.classList.remove('is-sender');
    }
  }

  // Initialize avatar on load
  updateInputAvatar();

  // Listen to character selection state changes reactively
  onStateChange(updateInputAvatar);

  // Listen to switch toggles
  if (ChatMainElements.sendSwitch) {
    ChatMainElements.sendSwitch.addEventListener('change', updateInputAvatar);
  }

  // 16. Click Input Selector opens character selection modal
  const inputCharSelector = document.getElementById('inputCharSelector');
  if (inputCharSelector) {
    inputCharSelector.addEventListener('click', () => {
      showElement("floatingReceiverSenderWindow", "flex");
      
      // Focus correct tab in character selector modal based on current switch state
      const isSender = ChatMainElements.sendSwitch && ChatMainElements.sendSwitch.checked;
      const tabToActivate = isSender ? 'tab2' : 'tab1';
      
      if (ChatNameElements.receiverSenderTabButtons && ChatNameElements.receiverSenderTabContents) {
        ChatNameElements.receiverSenderTabButtons.forEach(btn => {
          const match = btn.dataset.tab === tabToActivate;
          btn.classList.toggle('active', match);
          btn.setAttribute('aria-selected', match ? 'true' : 'false');
        });
        ChatNameElements.receiverSenderTabContents.forEach(content => {
          content.classList.toggle('active', content.id === tabToActivate);
        });
      }

      // Load character lists into the modal (moved from old #chat-name handler)
      if (ChatNameElements.receiverListDiv) {
        try {
          showCharList(ChatNameElements.receiverListDiv.id, 'receiver');
        } catch (error) {
          logError("Failed to display receiver list.\n  >> ", error);
        }
      }
      if (ChatNameElements.senderListDiv) {
        try {
          showCharList(ChatNameElements.senderListDiv.id, 'sender');
        } catch (error) {
          logError("Failed to display sender list.\n  >> ", error);
        }
      }
    });
  }

  // 16b. Sticker/Emoji button – placeholder alert
  const emojiBtn = document.getElementById('inputList');
  if (emojiBtn) {
    emojiBtn.addEventListener('click', () => {
      alert('Sticker and emoji picker coming soon!');
    });
  }

  // 17. Hide character selector and sender/receiver switch for non-message types
  // Also update placeholder text based on message type
  const msgTypeRadios = document.querySelectorAll('input[name="msgType"]');
  const updateContextualInputs = () => {
    const checkedEl = ChatMainElements.msgTypeChecked;
    const msgType = checkedEl ? checkedEl.value : 'text';
    const isText = msgType === 'text';
    
    const switchContainer = ChatMainElements.sendSwitch ? ChatMainElements.sendSwitch.closest('.switch') : null;
    const toggleChatLabel = document.getElementById('toggleChat');
    const charSelector = document.getElementById('inputCharSelector');
    
    // Update background color of the input field itself (#chat-input) based on type
    const inputField = ChatMainElements.input;
    if (inputField) {
      inputField.classList.remove('type-message', 'type-action', 'type-timestamp');
      if (msgType === 'text') inputField.classList.add('type-message');
      else if (msgType === 'action') inputField.classList.add('type-action');
      else if (msgType === 'timestamp') inputField.classList.add('type-timestamp');
    }

    if (isText) {
      switchContainer?.classList.remove('hidden');
      toggleChatLabel?.classList.remove('hidden');
      charSelector?.classList.remove('hidden');
    } else {
      switchContainer?.classList.add('hidden');
      toggleChatLabel?.classList.add('hidden');
      charSelector?.classList.add('hidden');
      if (ChatMainElements.sendSwitch) {
        ChatMainElements.sendSwitch.checked = false;
      }
    }

    // Dynamic placeholder based on message type
    if (ChatMainElements.input) {
      if (msgType === 'action') {
        ChatMainElements.input.placeholder = 'Type the action message...';
      } else if (msgType === 'timestamp') {
        ChatMainElements.input.placeholder = 'Enter time...';
      } else {
        ChatMainElements.input.placeholder = 'Type your message...';
      }
    }
  };

  msgTypeRadios.forEach(radio => {
    radio.addEventListener('change', updateContextualInputs);
  });

  // Set initial visibility
  updateContextualInputs();

  // 18. Direct Inline Editing on Bubble/Action/Timestamp Spans
  const chatMessagesContainer = document.getElementById('chat-messages');
  if (chatMessagesContainer) {
    // Focusout event triggers when target loses focus (bubbles unlike blur)
    chatMessagesContainer.addEventListener('focusout', (e) => {
      const target = e.target;
      if (target && target.hasAttribute('contenteditable') && target.dataset.editableType === 'message') {
        const msgId = target.getAttribute('data-id');
        const newText = target.textContent.trim();
        const originalMsg = getMessages().find(m => m.id === msgId);
        
        if (originalMsg) {
          if (newText === '') {
            // Restore original text if cleared
            target.textContent = originalMsg.text;
          } else if (newText !== originalMsg.text) {
            // Update message text
            editMessage(msgId, newText);
            renderMessages();
          }
        }
      }
    });

    chatMessagesContainer.addEventListener('click', (e) => {
      const target = e.target;
      if (!target || !target.hasAttribute('contenteditable')) return;
      if (target.dataset.editableType !== 'message') return;
      e.stopPropagation();
      document.querySelectorAll('.action-menu:not(.hidden)').forEach(menu => menu.classList.add('hidden'));
    });

    chatMessagesContainer.addEventListener('keydown', (e) => {
      const target = e.target;
      if (target && target.hasAttribute('contenteditable') && target.dataset.editableType === 'message') {
        if (e.key === 'Enter') {
          e.preventDefault(); // prevent newline insertion
          target.blur(); // trigger save
        }
      }
    });

    chatMessagesContainer.addEventListener('paste', (e) => {
      const target = e.target;
      if (target && target.hasAttribute('contenteditable') && target.dataset.editableType === 'message') {
        e.preventDefault();
        const text = (e.clipboardData || window.clipboardData).getData('text/plain');
        // Safely insert text at cursor position or replace selected text
        const selection = window.getSelection();
        if (!selection.rangeCount) return;
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(text));
        // Force update cursor to end of inserted text
        selection.collapseToEnd();
      }
    });
  }

}); // Clean exit point of DOMContentLoaded block