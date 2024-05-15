document.addEventListener('DOMContentLoaded', function() {
    var submitButton = document.querySelector('input[type="submit"]');
    if (submitButton) {
        submitButton.addEventListener('click', async function(event) {
            event.preventDefault(); // Stop the form from submitting through HTTP

            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
            const emojiPromises = [];

            days.forEach(day => {
                var topic = document.getElementById(`topic${day}`).value;
                var animator = document.getElementById(`animator${day}`).value;
                var timeZone = document.getElementById(`timeZone${day}`).value;
                var zoomLink;
                var passwordZoomLink;

                // Selecting Zoom link based on the animator
                switch(animator) {
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

                // Store the information in local storage
                localStorage.setItem(`${day}Topic`, topic);
                localStorage.setItem(`${day}Animator`, animator);
                localStorage.setItem(`${day}ZoomLink`, zoomLink);
                localStorage.setItem(`${day}TimeZone`, timeZone);
                localStorage.setItem(`${day}CanaryTime`, canaryTime);
                localStorage.setItem(`${day}ReunionTime`, reunionTime);
                localStorage.setItem(`${day}VietnamTime`, vietnamTime);
                localStorage.setItem(`${day}PolynesiaTime`, polynesiaTime);
                localStorage.setItem(`${day}PasswordZoomLink`, passwordZoomLink);

                // Fetch emoji from the server
                const emojiPromise = fetchEmoji(day, topic);
                emojiPromises.push(emojiPromise);
            });

            // Wait for all emojis to be fetched and stored
            await Promise.all(emojiPromises);

            // Redirect to the results page
            window.location.href = 'results.html';
        });
    } else {
        console.log('Submit button not found');
    }
});

// Function to fetch emoji from the server
async function fetchEmoji(day, topic) {
    try {
        const response = await fetch('http://localhost:3000/fetch-emoji', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ topic })
        });
        const data = await response.json();
        if (data.emoji) {
            localStorage.setItem(`${day}Emoji`, data.emoji);
            console.log(`${day} Emoji:`, data.emoji);
        } else {
            console.error(`No emoji returned for ${day}`);
        }
    } catch (error) {
        console.error(`Error fetching emoji for ${day}:`, error);
    }
}

// Function to convert time to different time zones
function convertTime(baseTime, baseOffset, targetOffset) {
    const baseDateTime = new Date(`2021-01-01T${baseTime}:00.000Z`);
    baseDateTime.setHours(baseDateTime.getHours() + targetOffset - baseOffset);
    return baseDateTime.toISOString().substring(11, 16);  // Return time in HH:MM format
}
