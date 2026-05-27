import { ChatMainElements, ChatNameElements } from './chat-elements.js';
import { logError, hasInputValue } from './helper-functions.js';
import { disableElement } from './app-style.js';
import { getJSONList } from './api.js';
import { initLoading } from './loading.js';
import './event-listeners.js';

let selectedReceiver = { name: "None", image: "" }; // Default receiver
let selectedSender = { name: "None", image: "" };   // Default sender
/* MAIN EXECUTABLES */

// Start loading sequence
initLoading();

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

  if (!selectedReceiver.name || !selectedSender.name) {
    console.warn("Please select both a sender and a receiver.");
    // Optionally, provide user feedback in the UI
    return;
  }

  const container = document.getElementById("chat-messages");
  const messageElement = document.createElement("div");
  const bubbleElement = document.createElement("div");
  const imageElement = document.createElement('img');

  const isSender = ChatMainElements.sendSwitch.checked;

  // create a new chat message element with the input value
  messageElement.classList.add(
    "chat-message",
    isSender ? "sender" : "receiver"
  );

  bubbleElement.classList.add("chat-bubble");
  bubbleElement.textContent = ChatMainElements.input.value;

  imageElement.classList.add('chat-image');
  imageElement.src = isSender ? selectedSender.image : selectedReceiver.image;
  imageElement.alt = isSender ? selectedSender.name : selectedReceiver.name;

  if (isSender) {
    messageElement.appendChild(bubbleElement);
    messageElement.appendChild(imageElement);
  } else {
    messageElement.appendChild(imageElement);
    messageElement.appendChild(bubbleElement);
  }

  /*
    if (ChatMainElements.sendSwitch.checked) {
      container.insertBefore(picElement, container.firstChild);
    } else if (!ChatMainElements.sendSwitch.checked) {
      container.appendChild(picElement);
    }
  */

  // append the new chat message element to the chat container
  container.appendChild(messageElement);

  // clear the input field

  // log the new message
  console.log(
    new Date().toLocaleString(),
    "//",
    ChatMainElements.sendSwitch.checked ? "Sender" : "Receiver",
    "\nMessage:",
    bubbleElement.textContent
  );
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
  "Khaenriah": "07",
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
  const container = document.getElementById(listContainerId);
  if (!container) {
    logError(`Container with ID ${listContainerId} not found.`);
    return;
  }

  container.innerHTML = ''; // Clear previous list

  try {
    const characters = list.characters;
    const fragment = document.createDocumentFragment();

    for (const region in characters) {
      if (characters.hasOwnProperty(region)) {
        for (const charName in characters[region]) {
          if (characters[region].hasOwnProperty(charName)) {
            // Apply search filter
            if (searchTerm && !charName.toLowerCase().includes(searchTerm.toLowerCase())) {
              continue; // Skip if character name doesn't match search term
            }

            const charElement = document.createElement('button');
            charElement.classList.add('character-list-item');
            charElement.textContent = charName;
            charElement.dataset.charName = charName;
            charElement.dataset.region = region;
            charElement.dataset.type = type;

            charElement.addEventListener('click', () => selectCharacter(charName, region, type));
            fragment.appendChild(charElement);
          }
        }
      }
    }
    container.appendChild(fragment);

    // Update initial selected names
    if (type === 'receiver') {
      ChatNameElements.receiverNameSpan.textContent = selectedReceiver.name;
    } else if (type === 'sender') {
      ChatNameElements.senderNameSpan.textContent = selectedSender.name;
    }

  } catch (error) {
    logError("Error populating character list: ", error);
  }
}

export function selectCharacter(charName, region, type) {
  const charImage = generateCharacterImageSrc(charName, region);

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
    selectedReceiver = { name: charName, image: charImage };
    ChatNameElements.receiverNameSpan.textContent = charName;
  } else if (type === 'sender') {
    selectedSender = { name: charName, image: charImage };
    ChatNameElements.senderNameSpan.textContent = charName;
  }
  console.log(`${type} selected: ${charName}, Image: ${charImage}`);
}

// Initialize default selections on load
document.addEventListener('DOMContentLoaded', async () => {
  const list = await getJSONList();
  const defaultCharName = "XIAOOOO"; // Assuming XIAOOOO is a valid character name in your JSON
  let defaultReceiverFound = false;
  let defaultSenderFound = false;

  for (const region in list.characters) {
    if (list.characters.hasOwnProperty(region)) {
      for (const charName in list.characters[region]) {
        if (charName === defaultCharName) {
          if (!defaultReceiverFound) {
            selectedReceiver = { name: defaultCharName, image: generateCharacterImageSrc(defaultCharName, region) };
            ChatNameElements.receiverNameSpan.textContent = defaultCharName;
            defaultReceiverFound = true;
          }
          if (!defaultSenderFound) {
            selectedSender = { name: defaultCharName, image: generateCharacterImageSrc(defaultCharName, region) };
            ChatNameElements.senderNameSpan.textContent = defaultCharName;
            defaultSenderFound = true;
          }
          if (defaultReceiverFound && defaultSenderFound) break;
        }
      }
    }
    if (defaultReceiverFound && defaultSenderFound) break;
  }
});