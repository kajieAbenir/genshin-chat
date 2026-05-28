// loading.js

// Function to show the loading animation
function toggleVisibility(idName = "", isVisible) {
    const element = document.getElementById(idName);
    if (element) {
        if (isVisible) {
            element.classList.remove("hidden"); // Let CSS handle the native visible display state
        } else {
            element.classList.add("hidden");
        }
    }
}

export function initLoading() {
    const handleLoad = () => {
        toggleVisibility("container", true);
        toggleVisibility("loading", false);
    };

    // If the window is already loaded (common with modules), fire immediately
    if (document.readyState === 'complete') {
        handleLoad();
    } else {
        window.addEventListener('load', handleLoad);
    }
}