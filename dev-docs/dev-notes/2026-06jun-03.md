# Dev Notes - June 3 2026
Hi. I've now officially released the **v0.6.7 pre-release** today! This includes all the 'most basic' functions for a fake chat maker. But, there are so much things that needs to be done aside from these functionalities that I've done and deployed.

## Why did you deploy a 'pre-release' version?
To start off, I'm a 70% self-learning web developer with a tight mobile data plan. Now, as much as I'd like to keep things more to myself, maybe I'd like to practice deploying this project first publicly before I proceed with the newest "WTF REALIZATIONS" list that I have now after I deployed this to Cloudflare.

For the next release, I'd like to throw as much features as possible, to make it welcoming, and functional as possible. I'm not being perfectionist, but I know the feeling that an idea has not been available to the app, so I really have to do my best as a solo JS developer.

### 🚀 Recent Updates
- **UI/UX Polish**: Added nation-themed highlights and dynamic hover gradients for character lists.
- **System Settings**: Implemented a background switcher and interface zoom controls (70%-150%) with persistent saving.
- **Core Features**: Migrated to ES6 Modules and added real-time character search filtering.

---

## [>> WTF REALIZATIONS for v1.0.0(?) release <<]

### TIER S - QoL Improvements / Life Changing

#### 1 - Change to Radio Buttons for Message / Action / Timestamp(new!)
**Description:**  
As you can see, the JS code has become quite a mess, even the switches are just "Switch" and "Action". But then, I realized, wait... I could've just put it like choices that can cancel others???

Logically it looks like ``[] Switch [] Action``

Next change it should look like ``[] Switch () Message () Action () Timestamp``

#### 2 - Change from Hover to Click/Tap for Message Actions (+ new features)
**Description:**  
Hover was not really mobile-friendly in the first place. This may leave mobile-only users to start over again over one simple mistake, because they cannot edit or delete a line.

With the clickable Message Action Menu, it should now look like:  
``[Change character] [Up] [Down] [Switch] [Edit] [Delete]``

The following are new things that will be seen on the new Message Action.

**2.1 - Vertical re-arrangement of messages** (new! Message Action)  
**Description:**  
PWEDE PALA TO!? I should look online how to do this. THIS IS SO COOL, VERY KAKKOII!

**2.2 In-message switching** (new! Message Action)  
**Description:** Simply put, when the message is sent, user can switch this message to the opposite (e.g. Receiver -> Sender) if they got it wrong.

**2.3 - Change Sender/Receiver** (new! Message Action)  
**Description:** I need an extensive online lookup for this. Pls send GO+99 with GoWatch ;-;

#### 3 - HTML Fixes & Changes
**Description:** I acknowledge that there are minor visual breaks in the app right now, and will do my best to fix these alongside the implementation of the features above.

#### 4 - Custom Background Image Upload
**Description:**  
*Uhmm... is this even Penacony?* - Acheron, probably (?)  
Kidding.

With our current roster of background images, I already expected that you will not be satisfied with that. On the next release I'll be putting an upload feature like the custom character.

**4.1 - Preset Background Changes**  
**Description:** I noticed after deployment that, using my potato spec laptop *(10-year old 4GB laptop)*, changing across the given background images requires more resources, and the image is pretty high quality as well. The quality is so high, that they won't even load sometimes ;-;

### TIER A - Considerables

#### 1 - Saved Chats + Auto-save
**Description:** Saving chats will be a new feature, because auto-saving are already implemented last *v0.6.7 pre-release*. Saved chats are labeled by user (you) so you can check it anytime soon.

#### 2 - Image as a message
**Description:** Perfect if you are sending screenshots or image reactions outside the sticker pack. I'm thinking Cyno bombing Tighnari memes, and Kaveh blatantly sending Alhaitham the "receipts" why he's cheating ;-;

#### 3 - More animations?
**Description:** *FAHHHHH*

### TIER X - Khaenri'ah's Doom List
*These are major pain in the head. Literally. I may or may not consider these ideas especially that these may be important. If you have other ideas, please let me know by opening an 'Issue' to the original repository and throw me the idea in there. Thanks!*

1 - STICKERS  
2 - CHAT REACTIONS (like in FB/IG)  
3 - MESSAGE THEMES (like in FB/IG)  
4 - VOICE MESSAGE?? not actual, but you determine/type the length of the audio  
5 - QUEST ATTACHMENT (like in HSR)  

## Wrap Up
I think that covers all? Basically, this update is more on finishing the 'basics' and learning myself how to deploy the app online. I have my shortcomings, knowing there will be competencies with this app with a framework and knowledge. But, regardless, I will still be delivering you the app with a great convenience in mind.

If you have anything to contribute, please initiate an 'Issue' in this repository. Thanks!