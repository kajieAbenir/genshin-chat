// initialization of get functions
import { logError } from './helper-functions.js';

/**
 * >> ASYNC FUNCTION <<
 * Gets the JSON list "char_info.json", parses it.
 * Returns the WHOLE parsed JSON stuff.
 * @returns {data}
 */
export async function getJSONList() {
  // fetches the JSON file
  let retries = 3;
  while (retries > 0) {
    try {
      const res = await fetch("./src/char_info.json");

      // parses it into code-friendly JSON
      const data = await res.json();

      return data;
    } catch (error) {
      retries--;

      logError(
        `Error fetching JSON list, retrying ${retries + 1} times\n  >>`,
        error
      );

      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
  console.log(">> Failed to fetch character list after 3 retries");
}