// app-chat
// reason : 
// > name
//  - get list of characters
//  - change name upon request
//  - change pic upon request

// addButton.addEventListener('click', function() {
//     // Create a new <div> element
//     const newDiv = document.createElement('div');

//     // Optionally, add some text content or attributes to the <div>
//     newDiv.textContent = 'This is a new div added by JavaScript!';
//     newDiv.style.border = '2px solid black';
//     newDiv.style.padding = '10px';
//     newDiv.style.marginTop = '10px';

//     // Append the new <div> to the body or another container
//     document.body.appendChild(newDiv);
// });

/* GLOBAL VARIABLES */
const container = document.getElementById('chat-container');
const input = document.getElementById('chat-input');
const switchCheck = document.getElementById('switch');


/* EXECUTABLE FUNCTIONS */

function addConversation (){
    const newDiv = document.createElement('div');

    if (switchCheck.checked) {
        console.log("Checkbox is checked!");
    } else {
        console.log("Checkbox is not checked.");
    }
}


// function addChatMessage() {
//   // Create elements
//   const img = document.createElement("img");
//   const messageDiv = document.createElement("div");
//   const bubbleDiv = document.createElement("div");

//   // Set attributes and classes
//   messageDiv.className = "chat-message receiver";
//   bubbleDiv.className = "chat-bubble";
//   bubbleDiv.textContent = "Hello! How can I help you today?";

//   // Append elements
//   messageDiv.appendChild(bubbleDiv);

//   // Assuming there's a chat container where messages should be added
//   const chatContainer = document.getElementById("chat-container");
//   chatContainer.appendChild(img);
//   chatContainer.appendChild(messageDiv);
// }

