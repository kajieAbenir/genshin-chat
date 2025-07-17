/* GLOBAL VARIABLES */
const container = document.getElementById("chat-messages");
const input = document.getElementById("chat-input");
const switchCheck = document.getElementById("switch");
const toggleInputMenu = document.getElementById("toggleInputMenu");

let toggleCount = 0;

/* EXECUTABLE FUNCTIONS */

function addConversation() {
  if (input.value == "") {
    input.style.background = "red";
    setTimeout(() => {
      input.style.background = "";
    }, 500);

    console.log(new Date().toLocaleString(), "No message");
    return;
  }

  const messageElement = document.createElement("div");
  const bubbleElement = document.createElement("div");

  messageElement.classList.add(
    "chat-message",
    switchCheck.checked ? "sender" : "receiver"
  );

  bubbleElement.classList.add("chat-bubble");
  bubbleElement.textContent = input.value;

  messageElement.appendChild(bubbleElement);
  container.appendChild(messageElement);

  input.value = "";

  console.log(
    new Date().toLocaleString(),
    "//",
    switchCheck.checked ? "Sender" : "Receiver",
    "\nMessage:",
    bubbleElement.textContent
  );
}

function changeBGImage(url) {
  document.getElementById("background-pic").style.backgroundImage =
    `url(${url})`;
}

/* EVENT LISTENERS */

// adds event listener to the input element
// when user press Enter, trigger the addConversation() function which will add the message to the chat log
document.getElementById("chat-input").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    addConversation();
  }
});

document.getElementById("closeButton").addEventListener("click", function () {
  document.getElementById("floatingWindow").style.display = "none";
});

document.getElementById("chat-name").addEventListener("click", function () {
  document.getElementById("floatingWindow").style.display = "flex";
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
