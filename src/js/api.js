// initialization of get functions
import { logError } from './helper-functions.js';

/**
 * >> ASYNC FUNCTION <<
 * Gets the JSON list "char_info.json", parses it.
 * Returns the WHOLE parsed JSON stuff.
 * @returns {data}
 */

let cachedCharListPromise = null; // Cache variable to store the fetched character list
export function getJSONList() {
  if (!cachedCharListPromise) {

    // Store the execution promise itself 
    cachedCharListPromise = (async () => {
      try {
        const res = await fetch("./src/data/char_info.json");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        return await res.json();
        
      } catch (error) {
        console.error("Failed to fetch character list:", error);
        
        // Reset the promise on failure so future interactions can attempt to retry
        cachedCharListPromise = null; 
        
        // FIX: Return an empty object shape so 'list.characters' safely evaluates to undefined/empty instead of throwing a TypeError 
        return { characters: {} }; 
      }
    })();
  }
  
  return cachedCharListPromise;
}

export function getCharacterIconURL(apiSlug) {
  if (!apiSlug) return "./src/char-img/default.png";
  const slugMap = {
    Aether: "PlayerBoy",
    Lumine: "PlayerGirl"
  };
  const resolvedSlug = slugMap[apiSlug] || apiSlug;
  return `https://gi.yatta.moe/assets/UI/UI_AvatarIcon_${resolvedSlug}.png`;
}
