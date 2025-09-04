// loading.js

// Function to show the loading animation

function apirOrDisapir(idName = "", boolSet) {

    const getId = document.getElementById(idName);

    // false for none, true for block
    getId.style.display = boolSet ? "none" : "block";
}

// to show the loadidng screen:
// - disappear the container while loading
// - appear the loading screen

window.onload = setTimeout(() => {
    apirOrDisapir("container",false)
    apirOrDisapir("loading",true)
}, 1500);

// then if loaded:
// - appear the container
// - disappear the loading screen

apirOrDisapir("container",true)
apirOrDisapir("loading",false)