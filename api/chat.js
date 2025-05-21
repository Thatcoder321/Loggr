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
          content: `You're a helpful assistant for a productivity app.

Your job is to take a user's natural language request and extract whether they are trying to add a task or a habit.

You must respond with only a valid JSON object like:

{
  "type": "task" or "habit",
  "item": "Cleanly formatted short name of the task or habit"
}

❗ Respond ONLY with the JSON. No introductions, no commentary, no extra text. The response must be valid JSON or nothing.

Examples:
Input: "Remind me to drink water every day"
→ Output: { "type": "habit", "item": "Drink water" }

Input: "I want to clean my room tomorrow"
→ Output: { "type": "task", "item": "Clean my room" }`
        },
        { role: 'user', content: message },
      ],
    });
    console.log("OPENAI RESPONSE:", completion);

    const content = completion.choices[0].message.content;
    try {
      const parsed = JSON.parse(content);
      return res.status(200).json(parsed);
    } catch (err) {
      return res.status(200).json({ error: "Could not parse AI response", raw: content });
    }
  } catch (error) {
    console.error('OpenAI error:', error.response?.data || error.message || error);
    return res.status(500).json({ error: 'OpenAI request failed' });
  }
}