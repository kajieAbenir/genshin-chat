// !! FOR STAGING !!
// ideas for staging

export function addConversation() {
  if (hasInputValue() === false) return;

  const container = document.getElementById("chat-messages");
  const isSender = ChatMainElements.sendSwitch.checked;
  
  // Determine who sent it
  const activeCharName = isSender ? activeSender : activeReceiver;
  const characterData = characterLookupMap[activeCharName];

  // 1. Structural Line Item Wrapper
  const messageLine = document.createElement("div");
  messageLine.classList.add("chat-message-line", isSender ? "sender" : "receiver");

  // 2. Avatar Node
  const picElement = document.createElement('div');
  picElement.classList.add("convo-pic");
  
  const avatarImg = document.createElement("img");
  // Set fallback default local avatar image if character isn't initialized yet
  avatarImg.src = characterData ? characterData.iconUrl : "assets/default-avatar.png";
  avatarImg.alt = activeCharName;
  picElement.appendChild(avatarImg);

  // 3. Text Bubble Node
  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content-wrapper");

  const bubbleElement = document.createElement("div");
  bubbleElement.classList.add("chat-bubble");
  bubbleElement.textContent = ChatMainElements.input.value;
  messageContent.appendChild(bubbleElement);

  // 4. Dom Assembly
  messageLine.appendChild(picElement);
  messageLine.appendChild(messageContent);
  container.appendChild(messageLine);

  // 5. Scroll view down smoothly
  container.scrollTop = container.scrollHeight;
  ChatMainElements.input.value = "";
}