// !! FOR STAGING !!
// ideas for staging

// selects all elements with .charlist class
// adds an event listener to each
document.querySelectorAll(".charlist").forEach(function (el) {
  el.addEventListener("click", function () {
    console.log("oten");
  });
});

// code for changing zoom/initial scale

document.getElementById("settings").addEventListener("click", function () {
  const currentScale = parseFloat(getComputedStyle(document.body).zoom);
  const newScale = currentScale + 0.1;
  document.body.style.zoom = newScale;
  console.log(`Zoom changed to ${newScale}`);
});

/** fetch image of a selected character
 * @returns {charImg}
 */
// DO NOT USE THIS!!!!

async function fetchAndDisplayImage(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the image data as a Blob
    const imageBlob = await response.blob();

    // Create a URL for the Blob
    const imageObjectURL = URL.createObjectURL(imageBlob);

    // Create an image element and set its source
    const imgElement = document.createElement("img");
    imgElement.src = imageObjectURL;
    imgElement.alt = "Fetched Image";

    // Append the image to the document body or a specific container
    document.body.appendChild(imgElement);

    // Clean up the object URL after the image has loaded to free up memory
    imgElement.onload = () => URL.revokeObjectURL(imageObjectURL);
  } catch (error) {
    console.error("Error fetching the image:", error);
  }
}

function setGenshinImgUrl(hex1 = "", hex2 = "", charName = "") {
  // return "https://static.wikia.nocookie.net/gensin-impact/images/b/bf/Adventures_in_Blazing_Hue_Icon.png"

  return `https://static.wikia.nocookie.net/gensin-impact/images/${hex1}/${hex2}/`
}

// Example usage:
fetchAndDisplayImage("https://example.com/path/to/your/image.jpg");

/*
// bennett skin
https://static.wikia.nocookie.net/gensin-impact/images/b/bf/Adventures_in_Blazing_Hue_Icon.png

// kaeya skin
https://static.wikia.nocookie.net/gensin-impact/images/b/b6/Kaeya_Icon.png
*/
