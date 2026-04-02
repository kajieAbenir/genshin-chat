import

/* HELPER FUNCTIONS */

// general console.error function
function logError(customMessage = "", errorObj) {
  if (!customMessage) {
    console.error("ERROR!!!\n\t", errorObj);
  } else {
    console.error(customMessage, errorObj);
  }
}

// for input checking
// checks if input is empty
function hasInputValue() {
  return ChatMainElements.input.value.trim() === "" ? false : true;
}

// do not use for now.
function changeBGImage(url = "") {
  document.getElementById("background-pic").style.backgroundImage =
    `url(${url})`;
}