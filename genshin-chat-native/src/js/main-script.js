import { ChatMainElements } from "./chat-elements.js";
import { logError } from "./helper-functions.js";
import { hasInputValue } from "./helper-functions.js";
import { disableElement } from "./helper-functions.js";
import { getJSONList } from "./api.js";

/* MAIN EXECUTABLES */

/**
 * Adds a new chat bubble to the chat container based on the input value.
 * If the input value is empty, logs a message and returns.
 * Otherwise, creates a new chat message element with the input value and
 * appends it to the chat container, then clears the input field.
*/

// TBA : add the image QwQ)
// after, refactor pud.
export function addConversation() {

  // if there's no content in input, return log msg "No msg"
  if (hasInputValue() == false) {
    console.log(new Date().toLocaleString(), "No message");
    disableElement(ChatMainElements.input.id);
    return;
  }

  const container = document.getElementById("chat-messages");

  // TBA : add picture element of character here
  /*
    const picElement = document.createElement('div');

    // place the pic here

    picElement.classList.add("convo-pic")
  */

  const messageElement = document.createElement("div");
  const bubbleElement = document.createElement("div");

  // create a new chat message element with the input value
  messageElement.classList.add(
    "chat-message",
    ChatMainElements.sendSwitch.checked ? "sender" : "receiver"
  );

  bubbleElement.classList.add("chat-bubble");
  bubbleElement.textContent = ChatMainElements.input.value;

  messageElement.appendChild(bubbleElement);

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
  ChatMainElements.input.value = "";

  // log the new message
  console.log(
    new Date().toLocaleString(),
    "//",
    ChatMainElements.sendSwitch.checked ? "Sender" : "Receiver",
    "\nMessage:",
    bubbleElement.textContent
  );
}

// shows character list
// currently on "figuring out" phase lol
export async function showCharList(idName) {
  const list = await getJSONList();
  
  try {
    const characters = list.characters;

    // logs character list (for dev only. remove after hahahaha)
    console.log(characters);
  } catch (error) {
    logError(error);
  }

  // const listContainer = document.getElementById(`${idName}`);
}

// dev refs: (added 8-sept-2025)
// usage (src: fb meta ai)
/*
  const url = "blablablablablabla"
  getJSONList(url).then(data => displayData(data, jsonDerulo))

  function displayData(data, jsonDerulo) {
    const results = []

    data.forEach((item) => {
      if(matchJSON(item, jsonDerulo)) {
        results.push(item);
      }
    })
  }

  function matchJSON(data, jsonDerulo) {
    const searchKeys = Object.keys(jsonDerulo)

    for (const key of jsonDerulo){
      if(typeof jsonDerulo[key] === 'object') {
        if(!data[key] || !matchJSON(data[key], jsonDerulo[key])) {
          return false;
        }
      } else if (data[key] !== jsonDerulo[key]) {
        return false;
      }
    }

    return true;
  }
*/