import { ChatMainElements, ChatNameElements, inputSection } from "./chat-elements.js";
import { hasInputValue, logError, debounce } from "./helper-functions.js";
import { disableElement, enableElement, showElement, hideElement, addActiveViaDataTab, removeActiveViaDataTab } from "./app-style.js";
import { addConversation, showCharList } from "./main-script.js";
import { CloseButtons } from "./chat-elements.js";
import { clearMessages } from "./message-manager.js";
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
      // Safely grab the upper and lower input rows directly from the DOM
      const lower = document.getElementById("chatInputLower");
      const upper = document.getElementById("chatInputUpper");

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
  const clearChatBtn = document.getElementById('clearChatBtn');
  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', function() {
      if (confirm('Are you sure you want to clear all messages? This cannot be undone.')) {
        clearMessages();
        renderMessages();
        hideElement("floatingSettingsWindow");
      }
    });
  }

}); // Clean exit point of DOMContentLoaded block