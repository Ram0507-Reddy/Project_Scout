/**
 * PromptWars - Gemini API Starter Client (JavaScript / Node.js)
 * Usage:
 *   npm install @google/genai dotenv
 *   node starter_gemini.js
 */
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("Missing GEMINI_API_KEY in environment variables.");
}

const ai = new GoogleGenAI({ apiKey });

export async function askGemini(prompt, systemInstruction = "You are an expert AI assistant for PromptWars.") {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
    },
  });

  return response.text;
}

// Quick Test
if (process.argv[1] === import.meta.filename) {
  console.log("Testing JS Gemini Client...");
  askGemini("Give a 1-line punchy slogan for an AI Hackathon project.")
    .then((res) => console.log("Response:\n", res))
    .catch((err) => console.error("Error:", err.message));
}
