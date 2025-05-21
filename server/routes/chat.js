const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You're a helpful assistant for a productivity app. When a user sends a message, extract whether they're trying to add a task or a habit, and return it in this format:

{
  "type": "task" or "habit",
  "item": "text of the task or habit"
}

If the message isn't understandable, return: {
  "error": "Could not understand"
}`,
        },
        { role: 'user', content: message },
      ],
    });

    const aiResponse = completion.data.choices[0].message.content;
    res.json({ result: aiResponse });
  } catch (error) {
    console.error('OpenAI error:', error);
    res.status(500).json({ error: 'OpenAI request failed' });
  }
});

module.exports = router;