// app-chat
// reason : 
// > name
//  - get list of characters
//  - change name upon request
//  - change pic upon request

/* GLOBAL VARIABLES */
const container = document.getElementById('chat-messages');
const input = document.getElementById('chat-input');
const switchCheck = document.getElementById('switch');


/* EXECUTABLE FUNCTIONS */

function addConversation() {
    const messageElement = document.createElement("div");
    const bubbleElement = document.createElement("div");

    messageElement.classList.add("chat-message", switchCheck.checked ? "sender" : "receiver");

    bubbleElement.classList.add("chat-bubble");
    bubbleElement.textContent = input.value;

    messageElement.appendChild(bubbleElement);
    container.appendChild(messageElement);

    input.value = "";
}

/* EVENT LISTENERS */

// adds event listener to the input element
// when user press Enter, trigger the addConversation() function which will add the message to the chat log
document.getElementById('chat-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        addConversation();
    }
});
