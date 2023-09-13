const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const axios = require("axios");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const apiKey = process.env.OPENAI_API_KEY;
const baseUrl =
  "https://api.openai.com/v1/engines/text-davinci-003/completions";

async function generateCompletion(input) {
  try {
    const prompt = input;
    const maxTokens = 500;
    const n = 1;

    const response = await axios.post(
      baseUrl,
      {
        prompt,
        max_tokens: maxTokens,
        n,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const { choices } = response.data;
    if (choices && choices.length > 0) {
      const completion = choices[0].text.trim();
      return completion;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

app.post("/convert", async (req, res) => {
  try {
    const { language, code } = req.body;
    const response = await generateCompletion(
      `Convert the given code to ${language}:\n${code}`
    );
    res.json({ response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// debug
app.post("/debug", async (req, res) => {
  try {
    const { code } = req.body;
    const response = await generateCompletion(
      `Debug the given code with explanation:\n${code}`
    );
    res.json({ response });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "An error occurred" });
  }
});

// quality check
app.post("/qualityCheck", async (req, res) => {
  try {
    const { code } = req.body;
    const response = await generateCompletion(
      `Check the quality of the given code and provide suggestions:\n${code}`
    );
    res.json({ response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
