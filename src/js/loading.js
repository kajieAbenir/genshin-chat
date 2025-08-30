// loading.js

// Function to show the loading animation

function apirOrDisapir(idName = "", boolSet) {

    const getId = document.getElementById(idName);

    // false for none, true for block
    getId.style.display = boolSet ? "none" : "block";
}

window.onload = setTimeout(() => {
    apirOrDisapir("container",false)
    apirOrDisapir("loading",true)
}, 1500);

apirOrDisapir("container",true)
apirOrDisapir("loading",false)