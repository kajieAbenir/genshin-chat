import { ChatMainElements } from './chat-elements.js';

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
  const element = inputElement ?? ChatMainElements.input;
  return element && element.value.trim() !== "";
}

/**
 * Returns a function that, as long as it continues to be invoked, will not
 * be triggered.
 */
export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

// do not use for now.
export function changeBGImage(url = "") {
  document.getElementById("background-pic").style.backgroundImage =
    `url(${url})`;
}