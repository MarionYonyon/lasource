import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import axios from 'axios';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { getWeekNumber } from '../js/utils.js';

dotenv.config({ path: './server/.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../')));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const daySchema = new mongoose.Schema({
  day: String,
  topic: String,
  animator: String,
  timeZone: String,
  zoomLink: String,
  passwordZoomLink: String,
  canaryTime: String,
  reunionTime: String,
  vietnamTime: String,
  polynesiaTime: String,
  emoji: String,
});

const weekSchema = new mongoose.Schema({
  weekNumber: Number,
  year: Number,
  days: [daySchema],
  timestamp: { type: Date, default: Date.now },
});

const WeekData = mongoose.model('WeekData', weekSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.post('/save-data', async (req, res) => {
  try {
    console.log('Received /save-data request');
    console.log('Request body:', req.body);
    const { weekNumber, year, days } = req.body;
    if (!weekNumber || !year || !Array.isArray(days) || days.length === 0) {
      console.error('Invalid request data');
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const updatedWeekData = await WeekData.findOneAndUpdate(
      { weekNumber, year },
      { $set: { days } },
      { upsert: true, new: true }
    );

    console.log('Data saved successfully:', updatedWeekData);
    res.status(200).json({ message: 'Data saved successfully', weekData: updatedWeekData });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.get('/get-data', async (req, res) => {
  try {
    const data = await WeekData.findOne().sort({ timestamp: -1 });
    console.log('Most recent data retrieved successfully:', data);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});

app.post('/fetch-emoji', async (req, res) => {
  console.log('Received POST request on /fetch-emoji');
  const { topic } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;
  const prompt = `Create a WhatsApp emoji based on the following topic (only one emoji): ${topic}`;
  console.log('hello from server:', apiKey, prompt);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              'Emoji Creator is designed to generate random WhatsApp emojis based on short texts, ensuring all suggested emojis are readily available for use in WhatsApp. It focuses on nice and positive vibes, particularly suited for a group of women, with an emphasis on emojis related to spirituality and other uplifting themes. This tool helps users add a joyful element to their daily communications by suggesting emojis that reflect warmth, positivity, and a touch of spirituality, easily copy-pasted into WhatsApp messages. Emojis are provided without explanations, offering a straightforward response to user prompts.',
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 150,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const emoji = response.data.choices[0].message.content;
    res.json({ emoji });
  } catch (error) {
    console.error(
      'Error fetching emoji:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: 'Failed to fetch emoji' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
