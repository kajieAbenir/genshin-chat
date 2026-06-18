# Dev Notes - June 3, 2026
## 🚀 Version 1.0.0: The "It's Finally Official" Release!

We made it. From a "70% self-learning" experiment to a fully functional, deployed web app. This version marks the official launch of **Genshin Chat**. No more "pre-release" warnings—we're ready for the big stage (even if my laptop is still a potato).

### 🌟 What's New? (The "WTF Realizations" addressed)

Based on the feedback and my own "WTF moments" from the v0.6.7 pre-release, here is what has been finalized for the 1.0.0 launch:

#### 1. The Power of Choice: Radio Controls
No more messy logic for message types. I’ve implemented the Radio Button group for **Message / Action / Time**. 
- **Message**: Standard chat bubbles.
- **Action**: Success-green styled lines (e.g., "Kaveh is now homeless").
- **Time**: Centered, muted timestamps to organize your lore.

#### 2. Mobile-Friendly Message Actions
Hovering was a mistake for our mobile travelers. I've moved to a **Click/Tap** menu. Now, clicking a message reveals the action suite:
- **Vertical Re-arrangement**: Use [Up] and [Down] buttons to move messages. It’s "Very Kakkoii" and actually works!
- **In-Message Switching**: Got the sender/receiver mixed up? Toggle the [Switch] button on the bubble itself.
- **Edit & Delete**: Cleaned up the UI to make correcting typos (or Cyno's jokes) easier than ever.

#### 3. Custom Backgrounds (The Penacony Fix)
You're no longer limited to my preset region images.
- **Upload Feature**: You can now upload your own background images.
- **Resource Management**: Custom uploads are handled locally to save my server bandwidth and your mobile data.
- **Clear BG**: Easily revert to the default Domain background if things get too cluttered.

#### 4. Saved Chats & Auto-Save
The local storage logic has been beefed up.
- **Persistent State**: Your current chat survives refreshes.
- **Chat Library**: Use the Settings pane to name and save your favorite "bangers" to a list and load them back later.

---

### 🛠 Technical Improvements
- **Refactored State Management**: Moved away from messy global variables to a centralized `app-state.js` module.
- **UI Scaling**: Added the interface zoom (70%-150%) to ensure the app looks good on everything from a massive monitor to a tiny phone.
- **Smart Avatars**: The input box now features a reactive avatar that changes shape and color depending on whether you're typing as the Sender or Receiver.

---

### 🧭 The Roadmap (What's next in Teyvat?)

I haven't forgotten about the **Khaenri'ah's Doom List**. These are major features that require more "GoWatch" data and brainpower:

1. **Stickers**: The biggest request. I'm looking for a way to bundle the 30+ sets without killing the load times.
2. **Export to Image**: The code is there (html2canvas), but it needs more testing for high-resolution stability.
3. **Image Messages**: Sending screenshots or memes directly into the chat flow.
4. **Chat Reactions**: Adding that "FB/IG" feel to individual bubbles.

---

## 💭 Final Words for v1.0.0
Building this has been a journey of "WTF" realizations and "AHA!" moments. As a solo developer, I’m proud of how far this vanilla JS project has come. 

If you encounter bugs, please remember I'm working with a 10-year-old laptop and limited data—be kind, but do open an **Issue** on GitHub!

**Happy Chatting, Travelers!**

*- kajieAbenir*
*(Vision: Cryo | Constellation: Scope Creep)*