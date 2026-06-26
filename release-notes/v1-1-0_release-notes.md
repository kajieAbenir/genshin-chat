# Dev Notes - June 24, 2026
## 🚀 Version 1.1.0: The Camera Update

We are back with another banger update for Genshin Chat! This update is heavily focused on what the community has been asking for: images, exporting, and making sure your masterpiece fake chats are ready to be shared with the world. 

### 🌟 What's New?

#### 1. Export to Image (Fully Operational!)
No more taking multiple screenshots and stitching them together like a mad scientist.
- The **Export to Image** button now works flawlessly using `html2canvas`.
- It captures the whole scene: your carefully picked **Title**, the **Background**, and the entire chat thread in a clean, high-resolution PNG format.

#### 2. Image Messages
You can now send actual images directly into the chat.
- Supported size is up to **5MB**.
- Perfect for sending memes, in-game screenshots, or whatever chaos you want to add to your roleplay.

#### 3. Tutorial Chat
For first-time visitors, the app now automatically loads a **Tutorial Chat** example. It gives a quick, interactive rundown of how everything works right inside the chat window. Don't worry, once you've seen it, it won't bother you again unless you load it from settings.

#### 4. Fanmade Icons Soft Launch!
There are already requests in the promotion posted in the Facebook group "Angel Share Bar and Resto" asking to add their beloved characters. Now, I'd like to address this:
- There are characters currently available. *Sandrone*, as of this update, is still set to debut as a playable character this **July 1st**. In light of this debut, I have already curated a "key" in the list so that when that fails on the day of release, I can just edit it and patch that in a minor versioning. This also applies to other characters that were already announced, especially the newly announced in Snezhnaya, which is by the way available in the list **BUT do not have the image due to its unavailability yet**.
- Those fully unavailable "major" characters (e.g. La Signora) do not have their own icons because they are (a) unplayable, or (b) an NPC to the Genshin's storyline. With that, I am now leveraging the use of fanmade arts with their own licensing applied. We'll begin to roll out some in this version, and will continue on the next versions if ever there are more available.
   - If there is something we can talk to regarding with the use of image to this project, please let me know.
- For acknowledgment of fan-made icons, [please see here](release-notes/other/file-use-acknowledgement.md).

---

### 🧭 The Roadmap (What's Next?)

I know what you're looking for, and it's coming...

1. **Stickers!** 
   - The code scaffold is actually already in the app right now, but I've disabled it for this release to polish the UI and figure out the best way to load the massive sticker packs without lagging out potato devices. Please expect this to rollout soon.
2. **Cloudflare Character Sync** 
   - I'm actually thinking about whether to continue this or not. I have started on working on a worker script that will automatically fetch and add new character data/icons as soon as they drop officially, so you don't have to wait for app updates to use the newest banners.

---

## 💭 Final Words

Thank you to everyone making banger posts with this tool. Your creativity is exactly why I built this. As always, everything runs locally in your browser, so keep making those masterpieces.

If you spot bugs, please please open an Issue on GitHub!

**Happy Chatting, Travelers!**

*- kajieAbenir*
*(Vision: Cryo | Constellation: Scope Creep)*
