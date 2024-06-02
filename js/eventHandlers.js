// Imports
import { fetchEmoji, getData, saveDataToServer } from "./api.js";
import { capitalizeFirstLetter, dayMapping, convertTime } from "./utils.js";

// Initialization Functions
export async function handleDOMContentLoaded() {
  let existingData = {};
  let topicsChanged = false;
  try {
    const data = await getData();
    const dayMap = dayMapping();
    data.forEach((entry) => {
      const dayId = dayMap[entry.day];
      if (dayId) {
        const dayCapitalize = capitalizeFirstLetter(dayId);
        document.getElementById(`topic${dayCapitalize}`).value = entry.topic;
        document.getElementById(`timeZone${dayCapitalize}`).value = entry.timeZone;
        document.getElementById(`animator${dayCapitalize}`).value = entry.animator;
        existingData[dayId] = {
          topic: entry.topic,
          timeZone: entry.timeZone,
          animator: entry.animator,
          emoji: entry.emoji,
        };
      }
    });
    Object.keys(dayMap).forEach((day) => {
      const dayId = dayMap[day];
      const dayCapitalize = capitalizeFirstLetter(dayId);
      document.getElementById(`topic${dayCapitalize}`).addEventListener("input", () => {
        topicsChanged = true;
      });
    });
  } catch (error) {
    console.error("Error fetching entries:", error);
  }

// Move the form submission event listener setup here
document.getElementById("submit").addEventListener("click", async (event) => {
  await handleFormSubmit(event);
});
}


// Event Handler Functions
export async function handleFormSubmit(event) {
  event.preventDefault(); // Stop the form from submitting through HTTP

  const timestamp = new Date().toISOString()
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; // TODO: use dayMapping (tip: Object.keys())
  const savePromises = [];

  for (const day of days) {
    const topic = document.getElementById(`topic${day}`).value;
    const animator = document.getElementById(`animator${day}`).value;
    const timeZone = document.getElementById(`timeZone${day}`).value;

    if (topic && animator && timeZone) { // Only process filled out fields
      let zoomLink, passwordZoomLink;

      // Selecting Zoom link based on the animator
      switch (animator) {
        case "Mathilde":
          zoomLink = "https://zoom.us/j/4070574180/";
          passwordZoomLink = "source";
          break;
        case "Marion":
          zoomLink = "https://zoom.us/j/8357188552/";
          passwordZoomLink = "source";
          break;
        case "Virginie":
          zoomLink = "https://zoom.us/j/5523814330/";
          passwordZoomLink = "source";
          break;
        case "Isabelle":
          zoomLink = "https://zoom.us/j/3550579438/";
          passwordZoomLink = "source";
          break;
        case "Duong":
          zoomLink = "https://zoom.us/j/3851743111/";
          passwordZoomLink = "1111";
          break;
        case "Camille":
          zoomLink = "https://zoom.us/j/6960552890/";
          passwordZoomLink = "source";
          break;
      }

      const canaryTime = convertTime(timeZone, 2, 1);
      const reunionTime = convertTime(timeZone, 2, 4);
      const vietnamTime = convertTime(timeZone, 2, 7);
      const polynesiaTime = convertTime(timeZone, 2, -10);

try {
    // Fetch emoji from the server
    const emoji = await fetchEmoji(topic);

      dayData = {
        day,
        topic,
        animator,
        timeZone,
        zoomLink,
        passwordZoomLink,
        canaryTime,
        reunionTime,
        vietnamTime,
        polynesiaTime,
        emoji,
        timestamp
      };

    // Save the data to the server
    const savePromise = saveDataToServer(dayData);
    savePromises.push(savePromise);
  } catch (error) {
    console.error(`Error handling data for ${day}:`, error);
  }
  }
}
  if (dayData) {
    await saveDataToServer(dayData); // Save the single entry

    // Redirect to the results page
    window.location.href = "results.html";
  } else {
    console.error("No valid data to save");
  }
}

document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
