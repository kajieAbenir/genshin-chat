/* HELPER FUNCTIONS */

// general console.error function
export function logError(customMessage = "", errorObj) {
  if (!customMessage) {
    console.error("ERROR!!!\n\t", errorObj);
  } else {
    console.error(customMessage, errorObj);
  }
}

// for input checking
// checks if input is empty
export function hasInputValue(inputElement) {
  // Use the passed inputElement or default to ChatMainElements.input if available
  const ChatMainElements = window.ChatMainElements || {}; // Fallback for testing
  return ChatMainElements.input && ChatMainElements.input.value.trim() !== "";
}

// do not use for now.
export function changeBGImage(url = "") {
  document.getElementById("background-pic").style.backgroundImage =
    `url(${url})`;
}