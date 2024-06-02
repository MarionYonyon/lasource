// converTime function
export function convertTime(baseTime, baseOffset, targetOffset) {
  const baseDateTime = new Date(`2021-01-01T${baseTime}:00.000Z`);
  baseDateTime.setHours(baseDateTime.getHours() + targetOffset - baseOffset);
  return baseDateTime.toISOString().substring(11, 16); // Return time in HH:MM format
}

// capitalizeFirstLetter function
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// dayMapping function
export function dayMapping() {
  return {
    Monday: "monday",
    Tuesday: "tuesday",
    Wednesday: "wednesday",
    Thursday: "thursday",
    Friday: "friday",
  };
}

// Function to generate the index HTML for each day's section
export function generateDaySection(day) {
  const dayCapitalize = day.charAt(0).toUpperCase() + day.slice(1);
  return `
    <section class="day" id="${day}">
      <h2>${dayCapitalize.toUpperCase()}</h2>
      <label for="topic${dayCapitalize}">Sujet du zoom:</label><br />
      <input type="text" id="topic${dayCapitalize}" name="topic${dayCapitalize}" /><br />
      <label for="timeZone${dayCapitalize}">Horaire FR:</label><br />
      <input type="time" id="timeZone${dayCapitalize}" name="timeZone${dayCapitalize}" min="00:00" max="23:59" /><br />
      <label for="animator${dayCapitalize}">Qui anime le zoom:</label><br />
      <select id="animator${dayCapitalize}" name="animator${dayCapitalize}">
        <option value="Mathilde">Mathilde</option>
        <option value="Marion">Marion</option>
        <option value="Virginie">Virginie</option>
        <option value="Isabelle">Isabelle</option>
        <option value="Duong">Thuy Duong</option>
        <option value="Camille">Camille</option>
      </select><br /><br />
    </section>
  `;
}

// Utility function to get the week number
export function getWeekNumber(d) {
  var date = new Date(d);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  var week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}