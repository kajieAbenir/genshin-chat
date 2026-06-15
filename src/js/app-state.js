// app-state.js
// Centralized state management for selectedSender and selectedReceiver
// No globals on window; module exports getters, setters, and init function.

let _selectedReceiver = { name: "None", image: "" };
let _selectedSender = { name: "None", image: "" };

// Simple observer list for state changes (currently unused but available for future extensions)
const _listeners = [];

export function getReceiver() {
  return _selectedReceiver;
}
export function getSender() {
  return _selectedSender;
}
export function setReceiver(receiver) {
  _selectedReceiver = receiver;
  _notify();
}
export function setSender(sender) {
  _selectedSender = sender;
  _notify();
}
export function onStateChange(callback) {
  if (typeof callback === "function") _listeners.push(callback);
}
function _notify() {
  _listeners.forEach((cb) => {
    try { cb(); } catch (e) { console.error("State change listener error", e); }
  });
}
// Initialization placeholder – can be called after DOMContentLoaded if needed.
export function initState(defaultName = "", getCharacterIconURL) {
  // This function can be expanded to load defaults from JSON.
  // For now, just set both sender and receiver to defaultName if provided.
  if (defaultName) {
    const defaultImg = getCharacterIconURL ? getCharacterIconURL(defaultName) : "";
    _selectedReceiver = { name: defaultName, image: defaultImg };
    _selectedSender = { name: defaultName, image: defaultImg };
    _notify();
  }
}
