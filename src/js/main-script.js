import { ChatMainElements, ChatNameElements } from './chat-elements.js';
import { logError, hasInputValue } from './helper-functions.js';
import { disableElement, enableElement } from './app-style.js';
import { getJSONList, getCharacterIconURL } from './api.js';
import { initLoading } from './loading.js';
import './event-listeners.js';
import { addMessage, initMessages, generateUUID, loadTutorialChat, shouldAutoLoadTutorial, markTutorialSeen } from './message-manager.js';
import { renderMessages } from './message-renderer.js';
import { getReceiver, getSender, setReceiver, setSender, initState } from './app-state.js';

// Removed global exports of selectedReceiver and selectedSender
// State is now managed via app-state module
/* MAIN EXECUTABLES */

async function initializeApp() {
  // Initialize messages from localStorage first so we can decide whether to show the tutorial.
  initMessages();

  if (shouldAutoLoadTutorial()) {
    const loaded = await loadTutorialChat();
    if (loaded) {
      markTutorialSeen();
    }
  }

  renderMessages();
  initLoading();
}

initializeApp();

/**
 * Adds a new chat bubble to the chat container based on the input value.
 * If the input value is empty, logs a message and returns.
 * Otherwise, creates a new chat message element with the input value and
 * appends it to the chat container, then clears the input field.
*/

export function addConversation() {

  // if there's no content in input, return log msg "No msg"
  if (hasInputValue() == false) {
    console.log(new Date().toLocaleString(), "No message");
    return;
  }

  const receiver = getReceiver();
  const sender = getSender();
  if (!receiver.name || !sender.name || 
      receiver.name === "None" || sender.name === "None") {
    alert("Please select both a sender and a receiver.");
    return;
  }

  let messageText = ChatMainElements.input.value;
  
  // Get message type
  const msgTypeEl = ChatMainElements.msgTypeChecked;
  const msgType = msgTypeEl ? msgTypeEl.value : 'text';

  // If message type is 'timestamp', set text to "-lorem ipsum-"
  if (msgType === 'timestamp') {
    messageText = `- ${messageText} -`;
  }

  const isSender = ChatMainElements.sendSwitch.checked; // This line should remain after messageText is potentially updated

  // Create message object
  const receiverState = getReceiver();
  const senderState = getSender();
  const messageObj = {
    id: generateUUID(),
    type: msgType,
    sender: senderState.name,
    senderImage: senderState.image,
    receiver: receiverState.name,
    receiverImage: receiverState.image,
    isSender: isSender,
    text: messageText,
    createdAt: new Date().toISOString(),
    editedAt: null
  };

  // Add to storage
  addMessage(messageObj);

  // Render all messages
  renderMessages();

  // Clear input
  ChatMainElements.input.value = "";
  disableElement(ChatMainElements.sendBtn);
}

const nationCodes = {
  "MC": "mc",
  "Mondstadt": "00",
  "Liyue": "01",
  "Inazuma": "02",
  "Sumeru": "03",
  "Fontaine": "04",
  "Natlan": "05",
  "Snezhnaya": "06",
  "Khaenri'ah": "07",
  "Others": "08",
  "Skins": "skins",
  "Non-Playable": "non-playable"
};

function generateCharacterImageSrc(characterName, region) {
  const code = nationCodes[region];
  if (!code) {
    console.warn(`Unknown region: ${region} for character: ${characterName}`);
    return ""; // Return empty or a default image path
  }
  // Normalize character name: replace spaces with underscores, convert to lowercase
  const normalizedName = characterName.replace(/\s/g, '_').toLowerCase();
  return `./src/char-img/${code}-${normalizedName}.png`;
}

// shows character list
export async function showCharList(listContainerId, type, searchTerm = "") {
  const list = await getJSONList();
  if (!list || !list.characters || typeof list.characters !== 'object') {
    console.error('Invalid character data loaded');
    return;
  }

  const container = document.getElementById(listContainerId);
  if (!container) {
    logError(`Container with ID ${listContainerId} not found.`);
    return;
  }

  container.innerHTML = ''; // Clear previous list

  try {
    const characters = list.characters;
    const fragment = document.createDocumentFragment();
    const lowerSearch = searchTerm.toLowerCase();

    for (const region in characters) {
      if (characters.hasOwnProperty(region)) {
        const lowerRegion = region.toLowerCase();

        for (const charName in characters[region]) {
          if (characters[region].hasOwnProperty(charName)) {
            const lowerCharName = charName.toLowerCase();

            // Apply search filter (Matches character name OR region name)
            if (searchTerm && !lowerCharName.includes(lowerSearch) && !lowerRegion.includes(lowerSearch)) {
              continue;
            }

            const charSlug = characters[region][charName];
            const charElement = document.createElement('button');
            charElement.classList.add('character-list-item');
            charElement.textContent = charName;
            charElement.setAttribute('data-char-name', charName);
            charElement.setAttribute('data-region', region);
            charElement.setAttribute('data-type', type);

            charElement.addEventListener('click', () => selectCharacter(charName, region, type, charSlug));
            fragment.appendChild(charElement);
          }
        }
      }
    }
    container.appendChild(fragment);

    // Update initial selected names
    if (type === 'receiver') {
      const recv = getReceiver();
      ChatNameElements.receiverNameSpan.textContent = recv.name;
    } else if (type === 'sender') {
      const snd = getSender();
      ChatNameElements.senderNameSpan.textContent = snd.name;
    }

  } catch (error) {
    logError("Error populating character list: ", error);
  }
}

export function selectCharacter(charName, region, type, charSlug) {
  // Priority: Online API URL from api.js, fallback to local path if slug is missing
  const charImage = charSlug ? getCharacterIconURL(charSlug) : generateCharacterImageSrc(charName, region);

  // Remove 'selected' class from previously selected item in the same list
  const currentSelected = document.querySelector(`.character-list-item.selected[data-type="${type}"]`);
  if (currentSelected) {
    currentSelected.classList.remove('selected');
  }

  // Add 'selected' class to the newly selected item
  const newlySelected = document.querySelector(`.character-list-item[data-char-name="${charName}"][data-type="${type}"]`);
  if (newlySelected) {
    newlySelected.classList.add('selected');
  }

  if (type === 'receiver') {
    setReceiver({ name: charName, image: charImage });
    ChatNameElements.receiverNameSpan.textContent = charName;
  } else if (type === 'sender') {
    setSender({ name: charName, image: charImage });
    ChatNameElements.senderNameSpan.textContent = charName;
  }
  // console.log(`${type} selected: ${charName}, Image: ${charImage}`);
}

export function setCustomCharacter(type, name, imageSrc) {
  const currentSelected = document.querySelector(`.character-list-item.selected[data-type="${type}"]`);
  if (currentSelected) {
    currentSelected.classList.remove('selected');
  }

  const finalName = name || "Custom";
  const finalImage = imageSrc || "./src/char-img/default.png";

  if (type === 'receiver') {
    setReceiver({ name: finalName, image: finalImage });
    ChatNameElements.receiverNameSpan.textContent = finalName;
  } else if (type === 'sender') {
    setSender({ name: finalName, image: finalImage });
    ChatNameElements.senderNameSpan.textContent = finalName;
  }
}

// Initialize default selections on load
document.addEventListener('DOMContentLoaded', async () => {
  const list = await getJSONList();
  // Initialize state with default character using app-state module
  initState("Aether", getCharacterIconURL);
  // Update UI spans after state init
  const recv = getReceiver();
  const snd = getSender();
  ChatNameElements.receiverNameSpan.textContent = recv.name;
  ChatNameElements.senderNameSpan.textContent = snd.name;
});
