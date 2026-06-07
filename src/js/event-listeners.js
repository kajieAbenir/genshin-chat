import { ChatMainElements, ChatNameElements, inputSection, CustomCharElements, CloseButtons, SettingsElements, BackgroundElements, UIScalingElements, ChatSavingElements } from "./chat-elements.js";
import { hasInputValue, logError, debounce } from "./helper-functions.js";
import { disableElement, enableElement, showElement, hideElement, addActiveViaDataTab, removeActiveViaDataTab } from "./app-style.js";
import { addConversation, showCharList, setCustomCharacter } from "./main-script.js";
import { clearMessages, saveCurrentChat, loadChat, deleteSavedChat, getSavedChats } from "./message-manager.js";
import { renderMessages } from "./message-renderer.js";

/* EVENT LISTENERS */

document.addEventListener("DOMContentLoaded", () => {

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

  // 3. Open Character Selection Floating Window
  if (ChatMainElements.chatName) {
    ChatMainElements.chatName.addEventListener("click", function () {
      showElement("floatingReceiverSenderWindow", "flex");

      if (ChatNameElements.receiverSenderTabButtons && ChatNameElements.receiverSenderTabContents) {
        ChatNameElements.receiverSenderTabButtons.forEach(btn => removeActiveViaDataTab(btn.dataset.tab));
        ChatNameElements.receiverSenderTabContents.forEach(content => content.classList.remove('active'));
        
        const defaultBtn = Array.from(ChatNameElements.receiverSenderTabButtons).find(btn => btn.dataset.tab === 'tab1');
        if (defaultBtn) {
          addActiveViaDataTab('tab1');
          document.getElementById('tab1')?.classList.add('active');
        }
      }

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
    const MAX_SIZE = 200 * 1024; // 200KB
    const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert('Please upload a valid image (PNG, JPEG, or WebP)');
      return false;
    }
    if (file.size > MAX_SIZE) {
      alert('Image must be smaller than 200KB');
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

}); // Clean exit point of DOMContentLoaded block
