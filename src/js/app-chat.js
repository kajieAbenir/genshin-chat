/* GLOBAL VARIABLE CLASS */

// patch 4-sept-2025 :

// quick fix - instead of implementing class to store global variables, 
// asking Google Gemini led to suggestion of using global object instead.

// reason : easy to use. no code pollution 
// (like what kind of frustration i had earlier when i refactored the code lolll)
let ChatMainElements = {
  input: document.getElementById("chat-input"),
  sendBtn: document.getElementById("send"),
  sendSwitch: document.getElementById("switch"),
  toggleInputMenu: document.getElementById("toggleInputMenu"),
  chatName: document.getElementById("chat-name")
};

// this one is for floating window receiver/sender selector
let ChatNameElements = {
  tabButtons: document.querySelectorAll('.tab-button'),
  tabContents: document.querySelectorAll('.tab-content')
};

/* HELPER FUNCTIONS */

// general console.log function
function logError(customMessage = "", errorObj) {
  // console.log("Custom message: " + customMessage);
  if (!customMessage) {
    console.log("ERROR!!!\n\t", errorObj);
  } else {
    console.log(customMessage, errorObj);
  }
}

// for input checking
// checks if input is empty
function hasInputValue() {
  return ChatMainElements.input.value.trim() === "" ? false : true;
}

/* STYLE FUNCTIONS */

function hideElement(id = "", display = "") {
  try {
    const element = document.getElementById(id);

    element.classList.add("hidden");
    element.classList.remove(display);

  } catch (error) {
    logError("Cannot hide element!", error)
  }
}

function showElement(id = "", display = "") {
  try {
    const element = document.getElementById(id);

    element.classList.add(display);
    element.classList.remove("hidden");

  } catch (error) {
    logError("Cannot show element!", error)
  }
}

// do not use for now.
function changeBGImage(url = "") {
  document.getElementById("background-pic").style.backgroundImage =
    `url(${url})`;
}

/* ENABLE / DISABLE ELEMENT */

function disableElement(id = "") {
  document.getElementById(id).disabled = true;
}

function enableElement(id = "") {
  document.getElementById(id).disabled = false;
}

/* MAIN EXECUTABLES */

/**
 * Adds a new chat bubble to the chat container based on the input value.
 * If the input value is empty, logs a message and returns.
 * Otherwise, creates a new chat message element with the input value and
 * appends it to the chat container, then clears the input field.
*/

// TBA : add the image QwQ)

function addConversation() {

  // if there's no content in input, return log msg "No msg"
  if (hasInputValue() === false) {
    console.log(new Date().toLocaleString(), "No message");
    disableElement(ChatMainElements.input.id);
    return;
  }

  const messageElement = document.createElement("div");
  const bubbleElement = document.createElement("div");

  // create a new chat message element with the input value
  messageElement.classList.add(
    "chat-message",
    ChatMainElements.sendSwitch.checked ? "sender" : "receiver"
  );

  bubbleElement.classList.add("chat-bubble");
  bubbleElement.textContent = ChatMainElements.input.value;

  const container = document.getElementById("chat-messages");

  messageElement.appendChild(bubbleElement);

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
async function showCharList(idName) {
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
  ChatMainElements.sendBtn.disabled = !hasInputValue();
});

// Displays sender & receiver list
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

// close button
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

// add conversation
ChatMainElements.sendBtn.addEventListener("click", function () {
  addConversation();
});

// for tabs

ChatNameElements.tabButtons.forEach(button => {
  button.addEventListener('click', () => {

    // Remove 'active' class from all buttons and content
    ChatNameElements.tabButtons.forEach(btn => btn.classList.remove('active'));
    ChatNameElements.tabContents.forEach(content => content.classList.remove('active'));

    // Add 'active' class to the clicked button
    button.classList.add('active');

    // Find the corresponding content and add 'active' class
    const targetId = button.getAttribute('data-tab');
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
});