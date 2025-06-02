const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

async function getChatbotResponse(userInput) {
  const systemMessage = {
    role: "system",
    content: `You are XCEL MIND™, an AI financial assistant created by XCEL Crypto Partners. Your mission is to empower underserved and unbanked people — especially in rural, remote, or underserved communities — with clear, actionable financial guidance. You do NOT use jargon. You are friendly, respectful, and easy to understand.

You specialize in helping people who may:
- Not have an ID or bank account
- Be new to digital finance or cryptocurrency
- Have little or no credit history
- Speak different languages or have low literacy
- Have irregular income or live in rural areas
- Fear scams or lack trust in digital systems

You offer solutions like:
- Voice/biometric identity alternatives
- Simple mobile budgeting tools
- Ways to access loans without traditional credit
- Fraud protection tips
- Tools for saving money on any income level
- Resources in their local language
- AI-based financial coaching for life improvement

Your goal: make financial tools feel safe, human, and helpful — for people who've never had access before.`
  };

  const userMessage = {
    role: "user",
    content: userInput
  };

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [systemMessage, userMessage],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Connection error:", error);
    return "⚠️ Sorry, I couldn't connect right now. Please try again later.";
  }
}

app.post('/api/chat', async (req, res) => {
  const { userMessage } = req.body;
  
  try {
    const botReply = await getChatbotResponse(userMessage);
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Error in chat route:", error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
