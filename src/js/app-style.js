import { logError } from './helper-functions.js';

/* STYLE FUNCTIONS */

export function hideElement(id = "", display = "") {
  try {
    const element = document.getElementById(id);

    element.classList.add("hidden");
    element.classList.remove(display);

  } catch (error) {
    logError("Cannot hide element!", error)
  }
}

export function showElement(id = "", display = "") {
  try {
    const element = document.getElementById(id);

    if(element.classList.contains("hidden")) {
      element.classList.remove("hidden");
    }

    element.classList.add(display);
  } catch (error) {
    logError("Cannot show element!", error)
  }
}


/* ENABLE / DISABLE ELEMENT */

export function disableElement(id) {
  if (!id) {
    logError(id);
    return;
  } 
  // else if (id instanceof HTMLElement) {
  //   id.disabled = true;
  //   return;
  // } 
  else if (typeof id === "string") {
    const el = document.getElementById(id);
    if (el) el.disabled = true;
  } else if (id instanceof HTMLElement) {
    id.disabled = true;
  }
}


export function enableElement(id) {
  if (!id) {
    logError(id);
    return;
  } else if (id instanceof HTMLElement) {
    id.disabled = false;
    return;
  } else if (typeof id === "string") {
    const el = document.getElementById(id);
    if (el) el.disabled = false;
    return;
  }
}

/* ADD/REMOVE 'ACTIVE' CLASS */
// note: for .tab-buttons class only.
// receives integer, process as "tabX" e.g. "tab1"

export function addActiveViaDataTab(dataTab = 0) {
  if (!dataTab) {
    logError("Invalid data-tab provided to addActiveViaDataTab.", dataTab);
    return;
  }

  const element = document.querySelector(`[data-tab="${dataTab}"]`);
  if (element) element.classList.add("active");
}

export function removeActiveViaDataTab(dataTab = 0) {
  if (!dataTab) {
    logError("Invalid data-tab provided to removeActiveViaDataTab.", dataTab);
    return;
  }

  const element = document.querySelector(`[data-tab="${dataTab}"]`);
  if (element) element.classList.remove("active");
}
