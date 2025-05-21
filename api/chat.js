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
          content: `You're a helpful assistant for a productivity app. The user will send natural language describing a task they want to do or a habit they want to build.

You must interpret their intent and return a JSON object with the following format:

{
  "type": "task" or "habit",
  "item": "cleanly formatted task or habit text here"
}

If you truly cannot determine the user's intent, return:
{
  "error": "Could not understand"
}

Examples:

Input: "remind me to drink water every day"
→ Output: { "type": "habit", "item": "Drink water" }

Input: "I want to clean my room tomorrow"
→ Output: { "type": "task", "item": "Clean my room" }

Be concise, capitalize items, and do not explain or add commentary.`
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