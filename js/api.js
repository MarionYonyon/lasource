// fetchEmoji function
export async function fetchEmoji(topic) {
    try {
      const response = await fetch("/fetch-emoji", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });
      const data = await response.json();
      if (data.emoji) {
        console.log(`Emoji fetched for topic "${topic}":`, data.emoji);
        return data.emoji;
      } else {
        console.error(`No emoji returned for topic "${topic}"`);
        return "";
      }
    } catch (error) {
      console.error(`Error fetching emoji for topic "${topic}":`, error);
      return "";
    }
  }

  // getData function
  export async function getData() {
    try {
      const response = await fetch("/get-data");
      return await response.json();
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  
  // saveDataToServer function
  export async function saveDataToServer(data) {
    try {
      const response = await fetch("/save-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        console.log("Data saved successfully:", result);
      } else {
        console.error("Failed to save data:", result.error);
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }
  