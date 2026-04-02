

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

    if(element.classList.contains("hidden")) {
      element.classList.remove("hidden");
    }

    element.classList.add(display);
  } catch (error) {
    logError("Cannot show element!", error)
  }
}


/* ENABLE / DISABLE ELEMENT */

function disableElement(id) {
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
    return;
  }
}

function enableElement(id) {
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

function addActiveViaDataTab(dataTab = 0) {
  if(!dataTab) {
    logError("Invalid data-tab. ", dataTab)
  }

  document.querySelector(`[data-tab="tab${dataTab}"]`).classList.add("active")
}

function removeActiveViaDataTab(dataTab = 0) {
  if(!dataTab) {
    logError("Invalid data-tab. ", dataTab)
  }

  document.querySelector(`[data-tab="tab${dataTab}"]`).classList.remove("active")
}