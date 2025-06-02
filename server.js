const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const chatRouter = require('./api/chat');
require('dotenv').config();

const app = express();
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Use the chat router
app.use('/api/chat', chatRouter);

// OpenAI configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Make openai available to other modules
app.set('openai', openai);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// For Vercel
module.exports = app;