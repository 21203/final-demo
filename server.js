// ======================
// SERVER SETUP
// ======================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// ======================
// MIDDLEWARE
// ======================
app.use(express.static("public"));
app.use(cors());
app.use(express.json());

// ======================
// GROQ CONFIG
// ======================
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

// ✅ ONLY USE SUPPORTED MODELS
const PRIMARY_MODEL = "llama-3.1-8b-instant";
const FALLBACK_MODEL = "mixtral-8x7b-32768";

if (!GROQ_API_KEY) {
  console.error("❌ GROQ_API_KEY missing in .env");
  process.exit(1);
}

// ======================
// CBC SYSTEM PROMPT
// ======================
const CBC_CONTEXT = `
You are an expert Kenyan CBC educator following KICD guidelines.

Rules:
- Simple English
- Kenyan examples (markets, farms, homes)
- Use locally available materials
- Age appropriate

Grade levels:
Grades 1–3: stories, songs, play
Grades 4–6: group work, discovery
Grades 7–10: projects, critical thinking
`;

// ======================
// AI ENDPOINT
// ======================
app.post("/api/ai-resources", async (req, res) => {
  const { grade, subject, query } = req.body;

  if (!grade || !subject || !query) {
    return res.status(400).json({
      error: "grade, subject, and query are required"
    });
  }

  const prompt = `
${CBC_CONTEXT}

Create a CBC learning resource.

Grade: ${grade}
Subject: ${subject}
Request: ${query}

FORMAT STRICTLY AS:
1. Learning Objective
2. Materials Needed
3. Step-by-Step Activity
4. Assessment Method
5. Real-World Kenyan Connection
`;

  try {
    const response = await callGroq(PRIMARY_MODEL, prompt);
    return res.json({ content: response });

  } catch (primaryError) {
    console.warn("⚠️ Primary model failed, trying fallback...");

    try {
      const fallbackResponse = await callGroq(FALLBACK_MODEL, prompt);
      return res.json({ content: fallbackResponse });

    } catch (fallbackError) {
      console.error("🔥 GROQ FAILURE:", fallbackError.response?.data || fallbackError.message);
      return res.status(500).json({
        error: "AI service temporarily unavailable"
      });
    }
  }
});

// ======================
// GROQ CALL FUNCTION
// ======================
async function callGroq(model, prompt) {
  const response = await axios.post(
    GROQ_URL,
    {
      model,
      messages: [
        { role: "system", content: "You are a helpful educational assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data.choices[0].message.content
    .replace(/\*\*/g, "")
    .replace(/#/g, "")
    .trim();
}

// ======================
// HEALTH CHECK
// ======================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    primaryModel: PRIMARY_MODEL,
    fallbackModel: FALLBACK_MODEL,
    groqKeyLoaded: true
  });
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
  console.log(`✅ SERVER RUNNING: http://localhost:${PORT}`);
  console.log("🔑 Groq API key loaded: true");
});
