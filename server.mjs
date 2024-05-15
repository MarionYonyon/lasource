import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.use(cors());
app.use(express.json());

app.post("/fetch-emoji", async (req, res) => {
  const { topic } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;
  const prompt = `Create a WhatsApp emoji based on the following topic (only one emoji): ${topic}`;
  console.log("hello from server:", apiKey, prompt);

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4",
        messages: [
          { role: "system", content: "Emoji Creator is designed to generate random WhatsApp emojis based on short texts, ensuring all suggested emojis are readily available for use in WhatsApp. It focuses on nice and positive vibes, particularly suited for a group of women, with an emphasis on emojis related to spirituality and other uplifting themes. This tool helps users add a joyful element to their daily communications by suggesting emojis that reflect warmth, positivity, and a touch of spirituality, easily copy-pasted into WhatsApp messages. Emojis are provided without explanations, offering a straightforward response to user prompts." },
          { role: "user", content: prompt }
        ],
        max_tokens: 150,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    const emoji = response.data.choices[0].message.content;
    res.json({ emoji });
  } catch (error) {
    console.error("Error fetching emoji:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch emoji" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
