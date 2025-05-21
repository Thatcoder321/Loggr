const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    console.log("MESSAGE RECEIVED:", message);
    const completion = await openai.chat.completions.create({
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
    console.log("OPENAI RESPONSE:", completion);

    const aiResponse = completion.choices[0].message.content;
    return res.status(200).json({ result: aiResponse });
  } catch (error) {
    console.error('OpenAI error:', error.response?.data || error.message || error);
    return res.status(500).json({ error: 'OpenAI request failed' });
  }
}