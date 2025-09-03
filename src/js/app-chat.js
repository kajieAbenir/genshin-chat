import * as apiLoader from './api.js';

/* GLOBAL VARIABLE CLASS */
class chatGlobalVars {

  // initializing public variables
  constructor() {
    this.input = document.getElementById("chat-input");
    this.sendBtn = document.getElementById("send");
    this.switchCheck = document.getElementById("switch");
    this.toggleInputMenu = document.getElementById("toggleInputMenu");
  }
}

// const input = document.getElementById("chat-input");
// const sendBtn = document.getElementById("send");
// const switchCheck = document.getElementById("switch");
// const toggleInputMenu = document.getElementById("toggleInputMenu");

/* EXECUTABLE FUNCTIONS */

// general console.log function
// TO-DO : make customMessage optional.
// SOLUTION : online searching (wa koy internet)
function logError(customMessage = "", errorObj) {
  // console.log("Custom message: " + customMessage);
  if (!customMessage) {
    console.log("ERROR!!!\n\t", errorObj);
  } else {
    console.log(customMessage, errorObj);
  }
}

// for input checking
function hasInputValue() {
  return chatGlobalVars.input.value.trim() === "" ? false : true;
}

/**
 * Adds a new chat bubble to the chat container based on the input value.
 * If the input value is empty, logs a message and returns.
 * Otherwise, creates a new chat message element with the input value and
 * appends it to the chat container, then clears the input field.
 */
function addConversation() {
  // if there's no content in input, return log msg "No msg"
  if (hasInputValue() === false) {
    console.log(new Date().toLocaleString(), "No message");
    return;
  }

  const messageElement = document.createElement("div");
  const bubbleElement = document.createElement("div");

  // create a new chat message element with the input value
  messageElement.classList.add(
    "chat-message",
    switchCheck.checked ? "sender" : "receiver"
  );

  bubbleElement.classList.add("chat-bubble");
  bubbleElement.textContent = input.value;

  const container = document.getElementById("chat-messages");

  messageElement.appendChild(bubbleElement);

  // append the new chat message element to the chat container
  container.appendChild(messageElement);

  // clear the input field
  input.value = "";

  // log the new message
  console.log(
    new Date().toLocaleString(),
    "//",
    switchCheck.checked ? "Sender" : "Receiver",
    "\nMessage:",
    bubbleElement.textContent
  );
}

// shows character list
async function showCharList(idName) {
  const list = await apiLoader.getJSONList();
  
  try {
    const characters = list.characters;

    // logs character list (for dev only. remove after hahahaha)
    console.log(characters);
  } catch (error) {
    logError(error);
  }

  // const listContainer = document.getElementById(`${idName}`);
}

function changeBGImage(url) {
  document.getElementById("background-pic").style.backgroundImage =
    `url(${url})`;
}

/* EVENT LISTENERS */

/**
 * When Enter key is pressed in the chat input, trigger the addConversation
 * function and prevent the default action (submitting the form).
 */
document.getElementById("chat-input").addEventListener("keydown", function (e) {
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
document.getElementById("chat-input").addEventListener("input", function () {
  chatGlobalVars.sendBtn.disabled = !hasInputValue();
});

document.getElementById("chat-name").addEventListener("click", function () {
  document.getElementById("floatingWindow").style.display = "flex";
  // call functions to show the characters
  try {
    showCharList("receiver-list");
  } catch (error) {
    logError("Failed to display receiver list.\n  >> ", error.message);
  }

  try {
    showCharList("sender-list");
  } catch (error) {
    logError("Failed to display sender list.\n  >> ", error);
  }
});

document.getElementById("closeButton").addEventListener("click", function () {
  document.getElementById("floatingWindow").style.display = "none";
});

// for chat input toggle.
toggleInputMenu.addEventListener("click", function () {
  const chatInputLowerIsHidden =
    document.getElementById("chatInputLower").style.display === "none";

  // - - - - -

  document.getElementById("chatInputLower").style.display =
    chatInputLowerIsHidden ? "flex" : "none";
  document.getElementById("chatInputUpper").style.display =
    chatInputLowerIsHidden ? "flex" : "none";

  toggleInputMenu.textContent = chatInputLowerIsHidden ? "Hide" : "Show";

  console.log(`Menu ${chatInputLowerIsHidden ? "shown" : "hidden"}`);
});