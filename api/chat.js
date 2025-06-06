const OpenAI = require('openai');

// Initialize OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an intelligent assistant for a productivity app. Your only job is to analyze a user's request and determine if they want to add a "task" or a "habit". You must respond with ONLY a valid JSON object in the format: { "type": "task" or "habit", "item": "The name of the task or habit" }. Do not add any extra text, commentary, or markdown. Your entire response must be the raw JSON object. Example: User says "add 'walk the dog' to my list". You respond with: {"type":"task","item":"Walk the dog"}`
        },
        { role: 'user', content: message },
      ],
      response_format: { type: "json_object" }, // Use JSON mode for guaranteed JSON output
    });

    const rawResponse = completion.choices[0].message.content;
    
    // The response from the AI should already be a JSON string. We parse it here.
    const parsedJson = JSON.parse(rawResponse);

    // Send the parsed JSON object back to the frontend
    return res.status(200).json(parsedJson);

  } catch (error) {
    console.error('OpenAI API Error:', error);
    return res.status(500).json({ error: 'Failed to get a response from the AI backend.' });
  }
};