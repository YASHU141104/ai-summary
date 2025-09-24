const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const openai = new OpenAIApi(
  new Configuration({ apiKey: process.env.OPENAI_API_KEY })
);

app.post('/summarize', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL required' });

  try {
    // Fetch article text using Mercury Parser or similar tool
    const articleRes = await fetch(`https://mercury.postlight.com/parser?url=${url}`, {
      headers: { 'x-api-key': process.env.MERCURY_KEY }
    });
    const article = await articleRes.json();

    if (!article.content) throw new Error('Article content not found');

    // Summarize using OpenAI
    const prompt = `Summarize this news article in structured format: Headline, Date, Source, Key Points (bullets), Short Summary.\n\n${article.content}`;
    const aiRes = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 400
    });

    res.json({ summary: aiRes.data.choices[0].text });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
