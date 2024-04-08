import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static('public'));
app.use(express.json());
app.post('/api/pokemon/trivia', async (req, res) => {
  try {
    const {
      pokemonName
    } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{
          role: 'system',
          content: `As a passionate Pokémon enthusiast, your task is to unveil captivating facts about ${pokemonName}. Craft an engaging presentation with finesse, ensuring it is both responsive and well-structured. Your presentation will be displayed in a modal. Ensure your presentation showcases intriguing tidbits about the chosen Pokémon, maintaining both accessibility and flair. Dive into the world of ${pokemonName} with enthusiasm and creativity! Limit the facts to 400 characters make each fact enclosed in appropriate header tags and paragraph tags. Start every trivia with the header "Meet ${pokemonName}"`
        }],
        max_tokens: 400
      })
    });
    const data = await response.json();
    if (data && data.choices && data.choices.length > 0) {
      const triviaMessage = data.choices[0].message.content;
      res.json({
        trivia: triviaMessage
      });
    } else {
      throw new Error('Trivia not found.');
    }
  } catch (error) {
    console.error('Error fetching Pokémon trivia:', error);
    res.status(500).json({
      error: 'Failed to fetch Pokémon trivia'
    });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});