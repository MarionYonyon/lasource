document.addEventListener("DOMContentLoaded", async function () {
  try {
    const response = await fetch("https://lasource.onrender.com/get-data");
    const weekDataArray = await response.json();
    
    console.log('Fetched weekData:', weekDataArray);  // Log the fetched data

    if (weekDataArray.length > 0) {
      const weekData = weekDataArray[0];  // Access the first element of the array

      if (weekData && weekData.days) {
        // Mapping day names to IDs
        const dayMapping = {
          Monday: "monday",
          Tuesday: "tuesday",
          Wednesday: "wednesday",
          Thursday: "thursday",
          Friday: "friday",
        };

        weekData.days.forEach((entry) => {
          const dayId = dayMapping[entry.day];
          if (dayId) {
            document.getElementById(`emoji${entry.day}`).textContent =
              entry.emoji || "";
            document.getElementById(`display${entry.day}Topic`).textContent =
              entry.topic;
            document.getElementById(`display${entry.day}TimeZone`).textContent =
              entry.timeZone;
            document.getElementById(`display${entry.day}CanaryTime`).textContent =
              entry.canaryTime;
            document.getElementById(
              `display${entry.day}ReunionTime`
            ).textContent = entry.reunionTime;
            document.getElementById(
              `display${entry.day}VietnamTime`
            ).textContent = entry.vietnamTime;
            document.getElementById(
              `display${entry.day}PolynesiaTime`
            ).textContent = entry.polynesiaTime;
            document.getElementById(`display${entry.day}ZoomLink`).textContent =
              entry.zoomLink;
            document.getElementById(
              `display${entry.day}PasswordZoomLink`
            ).textContent = entry.passwordZoomLink;
          }
        });
      } else {
        console.error("weekData.days is undefined or weekData is null");
      }
    } else {
      console.error("weekDataArray is empty");
    }
  } catch (error) {
    console.error("Error fetching results:", error);
  }
});
