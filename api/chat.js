const express = require('express');
const router = express.Router();

// Chat history (note: this won't persist between function calls on Vercel)
let chatHistory = [];

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const openai = req.app.get('openai');
    
    // Add user message to chat history
    chatHistory.push({ role: 'user', content: message });

    // Prepare the messages for OpenAI API
    const messages = [
      { role: 'system', content: 'You are a helpful assistant for XCEL MIND, providing advice on small business, finance, and AI-based gig work.' },
      ...chatHistory
    ];

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    const assistantMessage = response.data.choices[0].message.content;

    // Add assistant's response to chat history
    chatHistory.push({ role: 'assistant', content: assistantMessage });

    res.json({ message: assistantMessage, history: chatHistory });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

module.exports = router;
