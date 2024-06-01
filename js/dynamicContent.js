// Import the generateDaySection function from utils.js
import { generateDaySection } from './utils.js';

// Define the days for which you want to generate sections
const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

// Get the container element where the day sections will be inserted
const container = document.getElementById('daysContainer');

// Loop through each day and generate the corresponding section HTML
days.forEach(day => {
  container.innerHTML += generateDaySection(day);
});

// Import and execute the main.js script
import './main.js';
