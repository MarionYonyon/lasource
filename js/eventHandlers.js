// Imports
import { fetchEmoji, getData, saveDataToServer } from "./api.js";
import {
  capitalizeFirstLetter,
  dayMapping,
  convertTime,
  getWeekNumber,
} from "./utils.js";

// Initialization Functions
export async function handleDOMContentLoaded() {
  let existingData = {};
  let topicsChanged = false;
  try {
    const data = await getData();
    console.log('Fetched data:', data);  // Log the fetched data

    if (data && data.days && Array.isArray(data.days)) {
      const weekData = data;  // Directly use the fetched object

      if (weekData.days.length > 0) {
        const dayMap = dayMapping();
        weekData.days.forEach((entry) => {
          const dayId = dayMap[entry.day];
          if (dayId) {
            const dayCapitalize = capitalizeFirstLetter(dayId);
            document.getElementById(`topic${dayCapitalize}`).value = entry.topic;
            document.getElementById(`timeZone${dayCapitalize}`).value =
              entry.timeZone;
            document.getElementById(`animator${dayCapitalize}`).value =
              entry.animator;
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
          document
            .getElementById(`topic${dayCapitalize}`)
            .addEventListener("input", () => {
              topicsChanged = true;
            });
        });
      } else {
        console.error("weekData.days is empty");
      }
    } else {
      console.error("Fetched data is not an object or days is not an array");
    }
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

  const timestamp = new Date().toISOString();
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; // TODO: use dayMapping (tip: Object.keys())
  const weekData = {
    weekNumber: getWeekNumber(new Date()),
    year: new Date().getFullYear(),
    days: [],
  };

  for (const day of days) {
    const topic = document.getElementById(`topic${day}`).value;
    const animator = document.getElementById(`animator${day}`).value;
    const timeZone = document.getElementById(`timeZone${day}`).value;

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
      case "Morgane":
        zoomLink = "https://zoom.us/j/79880046588/"
        passwordZoomLink = "diK00REEfZvcMcjniZkxbFbfiEm46r.1"
    }

    const canaryTime = convertTime(timeZone, 2, 1);
    const reunionTime = convertTime(timeZone, 2, 4);
    const vietnamTime = convertTime(timeZone, 2, 7);
    const polynesiaTime = convertTime(timeZone, 2, -10);

    try {
      // Fetch emoji from the server
      const emoji = await fetchEmoji(topic);

      const dayData = {
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
      };

      // Add the day data to the week data
      weekData.days.push(dayData);
    } catch (error) {
      console.error(`Error handling data for ${day}:`, error);
    }
  }

  console.log("Submitting week data to server:", weekData);

  // Save the entire week data to the server
  await saveDataToServer(weekData);

  // Redirect to the results page
  window.location.href = "results.html";
}

// Add event listener for DOMContentLoaded to initialize the form
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);
