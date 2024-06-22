// Import the generateDaySection function from utils.js
import { generateDaySection } from './utils.js';
// Import and execute the main.js script
import './main.js';

	
// Show the loading indicator
const loadingIndicator = document.getElementById('loadingIndicator');
loadingIndicator.style.display = 'flex';

// Define the days for which you want to generate sections
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

// Get the container element where the day sections will be inserted
const container = document.getElementById('daysContainer');

// Loop through each day and generate the corresponding section HTML
days.forEach(day => {
  container.innerHTML += generateDaySection(day);
});

// Hide the loading indicator and show the content once the data is loaded
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { // Simulating the delay caused by server spin-up
    loadingIndicator.style.display = 'none';
    container.style.display = 'block';
    document.getElementById('submit').style.display = 'block';
  }, 50000); // Adjust this delay to match your server spin-up time if necessary
});
