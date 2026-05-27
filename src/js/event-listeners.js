import { ChatMainElements, ChatNameElements } from "./chat-elements.js";
import { hasInputValue, logError } from "./helper-functions.js";
import { disableElement, enableElement, showElement, hideElement, addActiveViaDataTab, removeActiveViaDataTab } from "./app-style.js";
import { addConversation, showCharList } from "./main-script.js";
import { CloseButtons } from "./chat-elements.js";


/* EVENT LISTENERS */

/**
 * When Enter key is pressed in the chat input, trigger the addConversation
 * function and prevent the default action (submitting the form).
 */
ChatMainElements.input.addEventListener("keydown", function (e) {
  // Only prevent default when Enter is pressed so typing isn't blocked
  if (e.key === "Enter") {
    e.preventDefault();
    try {
      addConversation();
    } catch (error) {
      logError("Unable to add message.\n  >> ", error);
    }
  }
});

/**
 * When the chat input is changed, check if the input field is empty or not.
 * If it is empty, disable the send button. Otherwise, enable it.
 */
ChatMainElements.input.addEventListener("input", function () {
  if (hasInputValue() === false) {
    disableElement(ChatMainElements.sendBtn);
  } else {
    enableElement(ChatMainElements.sendBtn);
  }
});

// Displays sender & receiver list
ChatMainElements.chatName.addEventListener("click", function () {
  showElement("floatingReceiverSenderWindow","flex");

  // Initially populate both lists
  try {
    showCharList(ChatNameElements.receiverListDiv.id, 'receiver');
  } catch (error) {
    logError("Failed to display receiver list.\n  >> ", error);
  }

  try {
    showCharList(ChatNameElements.senderListDiv.id, 'sender');
  } catch (error) {
    logError("Failed to display sender list.\n  >> ", error);
  }
});

// Search functionality for receiver list
ChatNameElements.recvSearchInput.addEventListener('input', function() {
  const searchTerm = this.value;
  showCharList(ChatNameElements.receiverListDiv.id, 'receiver', searchTerm);
});

// Search functionality for sender list
ChatNameElements.sendSearchInput.addEventListener('input', function() {
  const searchTerm = this.value;
  showCharList(ChatNameElements.senderListDiv.id, 'sender', searchTerm);
  }
);

// close button for receiver / sender window
CloseButtons.senderReceiver.addEventListener("click", function () {
  hideElement("floatingReceiverSenderWindow","flex")
});

// for chat input toggle.
// TBA : for refactor
ChatMainElements.toggleInputMenu.addEventListener("click", function () {
  const chatInputLowerIsHidden =
    document.getElementById("chatInputLower").style.display === "none";
  // - - - - -

  document.getElementById("chatInputLower").style.display =
    chatInputLowerIsHidden ? "flex" : "none";
  document.getElementById("chatInputUpper").style.display =
    chatInputLowerIsHidden ? "flex" : "none";

  ChatMainElements.toggleInputMenu.textContent = chatInputLowerIsHidden ? "Hide" : "Show";

  console.log(`Menu ${chatInputLowerIsHidden ? "shown" : "hidden"}`);
});

// add conversation
ChatMainElements.sendBtn.addEventListener("click", function () {
  addConversation();
});

// show settings window
ChatMainElements.settings.addEventListener("click", function () {
  showElement("floatingSettingsWindow", "flex")
})

// close button for settings window
CloseButtons.settingsCredits.addEventListener("click", function () {
  hideElement("floatingSettingsWindow","flex")
});

// for tabs (general)
ChatNameElements.tabButtons.forEach(button => {
  button.addEventListener('click', () => {

    // Remove 'active' class from all buttons
    ChatNameElements.tabButtons.forEach(btn => removeActiveViaDataTab(btn.dataset.tab));
    // Remove 'active' class from all content
    ChatNameElements.tabContents.forEach(content => content.classList.remove('active')); // Assuming content IDs match data-tab

    // Add 'active' class to the clicked button
    addActiveViaDataTab(button.dataset.tab);

    // Find the corresponding content and add 'active' class
    const targetId = button.getAttribute('data-tab');
    document.getElementById(targetId)?.classList.add('active');
  });
});