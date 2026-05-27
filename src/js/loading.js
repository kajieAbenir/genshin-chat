// loading.js

// Function to show the loading animation
function toggleVisibility(idName = "", isVisible) {
    const getId = document.getElementById(idName);
    if (getId) {
        getId.style.display = isVisible ? "block" : "none";
    }
}

export function initLoading() {
    window.addEventListener('load', () => {
        toggleVisibility("container", true);
        toggleVisibility("loading", false);
    });
}