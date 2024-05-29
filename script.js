document.addEventListener('DOMContentLoaded', function() {
    var submitButton = document.querySelector('input[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', async function(event) {
            event.preventDefault(); // Stop the form from submitting through HTTP

            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            const savePromises = [];

            for (const day of days) {
                var topic = document.getElementById(`topic${day}`).value;
                var animator = document.getElementById(`animator${day}`).value;
                var timeZone = document.getElementById(`timeZone${day}`).value;
                var zoomLink;
                var passwordZoomLink;

                // Selecting Zoom link based on the animator
                switch (animator) {
                    case 'Mathilde':
                        zoomLink = 'https://zoom.us/j/4070574180/';
                        passwordZoomLink = 'source';
                        break;
                    case 'Marion':
                        zoomLink = 'https://zoom.us/j/8357188552/';
                        passwordZoomLink = 'source';
                        break;
                    case 'Virginie':
                        zoomLink = 'https://zoom.us/j/5523814330/';
                        passwordZoomLink = 'source';
                        break;
                    case 'Isabelle':
                        zoomLink = 'https://zoom.us/j/3550579438/';
                        passwordZoomLink = 'source';
                        break;
                    case 'Duong':
                        zoomLink = 'https://zoom.us/j/3851743111/';
                        passwordZoomLink = '1111';
                        break;
                }

                var canaryTime = convertTime(timeZone, 2, 1);
                var reunionTime = convertTime(timeZone, 2, 4);
                var vietnamTime = convertTime(timeZone, 2, 7);
                var polynesiaTime = convertTime(timeZone, 2, -10);

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
                    emoji // Include the fetched emoji
                };

                // Save the data to the server
                const savePromise = saveDataToServer(dayData);
                savePromises.push(savePromise);
            }

            // Wait for all data to be saved
            await Promise.all(savePromises);

            // Redirect to the results page
            window.location.href = 'results.html';
        });
    } else {
        console.log('Submit button not found');
    }
});

// Function to fetch emoji from the server
async function fetchEmoji(topic) {
    try {
        const response = await fetch('https://lasource.onrender.com/fetch-emoji', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic })
        });
        const data = await response.json();
        if (data.emoji) {
            console.log(`Emoji fetched for topic "${topic}":`, data.emoji);
            return data.emoji;
        } else {
            console.error(`No emoji returned for topic "${topic}"`);
            return '';
        }
    } catch (error) {
        console.error(`Error fetching emoji for topic "${topic}":`, error);
        return '';
    }
}

// Function to save data to the server
async function saveDataToServer(data) {
    try {
        const response = await fetch('https://lasource.onrender.com/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            console.log('Data saved successfully:', result);
        } else {
            console.error('Failed to save data:', result.error);
        }
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

// Function to convert time to different time zones
function convertTime(baseTime, baseOffset, targetOffset) {
    const baseDateTime = new Date(`2021-01-01T${baseTime}:00.000Z`);
    baseDateTime.setHours(baseDateTime.getHours() + targetOffset - baseOffset);
    return baseDateTime.toISOString().substring(11, 16);  // Return time in HH:MM format
}
