import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import axios from "axios";
import mongoose from "mongoose";
import { getWeekNumber } from './utils.js';

// Load .env file from the ./server directory
dotenv.config({ path: "./server/.env" });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define schemas and models for storing data
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

const WeekData = mongoose.model("WeekData", weekSchema);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Route to store data
app.post("/save-data", async (req, res) => {
  try {
    const { day, topic, animator, timeZone, zoomLink, passwordZoomLink, canaryTime, reunionTime, vietnamTime, polynesiaTime, emoji } = req.body;

    const currentDate = new Date();
    const weekNumber = getWeekNumber(currentDate);
    const year = currentDate.getFullYear();

    const newDayData = {
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

    // Find the document for the current week, or create a new one if it doesn't exist
    const updatedWeekData = await WeekData.findOneAndUpdate(
      { weekNumber: weekNumber, year: year },
      { $push: { days: newDayData } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Data saved successfully", weekData: updatedWeekData });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// Route to retrieve data
app.get("/get-data", async (req, res) => {
  try {
    const data = await WeekData.find({});
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

// Route to fetch emoji from ChatGPT API
app.post("/fetch-emoji", async (req, res) => {
  console.log("Received POST request on /fetch-emoji");
  const { topic } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;
  const prompt = `Create a WhatsApp emoji based on the following topic (only one emoji): ${topic}`;
  console.log("hello from server:", apiKey, prompt);

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "Emoji Creator is designed to generate random WhatsApp emojis based on short texts, ensuring all suggested emojis are readily available for use in WhatsApp. It focuses on nice and positive vibes, particularly suited for a group of women, with an emphasis on emojis related to spirituality and other uplifting themes. This tool helps users add a joyful element to their daily communications by suggesting emojis that reflect warmth, positivity, and a touch of spirituality, easily copy-pasted into WhatsApp messages. Emojis are provided without explanations, offering a straightforward response to user prompts.",
          },
          { role: "user", content: prompt },
        ],
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const emoji = response.data.choices[0].message.content;
    res.json({ emoji });
  } catch (error) {
    console.error(
      "Error fetching emoji:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch emoji" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
