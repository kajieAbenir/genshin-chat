# Convert Genshin Chat JS to Angular

This implementation plan outlines the migration of the Genshin Chat Simulator from a Vanilla HTML/JS/CSS application to an Angular framework. 

## Timeline Assessment
**Yes, you can easily do it within 3 weeks.** The current application is relatively lightweight, with around 8 small JavaScript files and a single HTML index. A developer familiar with Angular (or working with an AI assistant like me) could comfortably migrate this within **3 to 7 days**, leaving plenty of extra time in your 3-week window for testing, refinement, and adding newer, richer features. 

## User Review Required

> [!IMPORTANT]
> Since this is a framework migration, we will need to set up a completely new Angular workspace. My recommended approach is to generate a new Angular project in this directory (or a subdirectory) and port the logic over component by component. 
> 
> Please let me know whether you want the Angular app initialized directly in the root of `g:\CODING FOLDER\genshin-chat-js` (which will require cleaning up some existing files first), or if you'd prefer to generate it in a subfolder (e.g., `genshin-chat-ng/`) to keep the old code completely safe while we transition.

## Proposed Changes

We will restructure the Vanilla JS architecture into Angular components, services, and modules. 

### Angular Setup & Architecture

- Initialize a new Angular application using the Angular CLI.
- Add modern styling optimizations if preferred (SCSS).

### Components Structure
We will break down `index.html` into modular Angular components:

#### [NEW] `app.component`
The root container that holds the background and orchestrates child components.

#### [NEW] `chat-container.component`
Will replace the main `div#chat-container`. Handles displaying chat messages, headers, and the inputs (`chat-input`, toggles, settings buttons).

#### [NEW] `floating-window.component`
A reusable component to host floating modal-like views (like `floatingReceiverSenderWindow` and `floatingSettingsWindow`). Will accept different inputs depending on if it's the Character Selector or the Settings/Credits screen.

#### [NEW] `character-selector.component`
Will contain the logic from tabs 1 and 2 (Receiver/Sender search and selection lists) inside the floating window.

#### [NEW] `loading-screen.component`
To handle the initial page loading state.

### Services Structure
We will port `src/js` functionality into reusable Angular services.

#### [NEW] `api.service.ts`
Replaces `api.js`. Will handle async data fetching (like `char_info.json`).

#### [NEW] `chat-state.service.ts`
Replaces variables spread across `event-listeners.js` and `main-script.js`. Will keep track of the currently selected sender, receiver, and chat message history using RxJS Subjects/Signals.

### Styles & Assets
- Move `src/bg-img`, `src/char-img`, and JSON resources into the Angular `src/assets/` folder.
- Port Vanilla CSS (`src/css/index.css`) either globally or scoped per component structure for better isolation.

## Open Questions

> [!WARNING]
> 1. Do you have the Angular CLI currently installed globally on your machine (`npm install -g @angular/cli`)? If not, we can use `npx` to bootstrap it or I can help you install it.
> 2. Should we initialize the new Angular project inside a subfolder, and delete the old files once the migration is fully functionally verified? 

## Verification Plan

### Automated Tests
- Scaffolded Angular component tests (Jasmine/Karma) will be checked if they render successfully without crashing.

### Manual Verification
- We will boot up the Angular dev server (`ng serve`).
- Verify all original flows: loading screen goes away, character selection works, toggling between sender/receiver is preserved, and typing/sending chat messages is fully functional.
