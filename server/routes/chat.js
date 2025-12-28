const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const router = express.Router();


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Send prompt to Gemini AI
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    // Send back the AI-generated text
    res.json({ text: response.text });
  } catch (error) {
    console.error('Error calling Gemini API', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

module.exports = router;