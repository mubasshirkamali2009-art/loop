/**
 * Gemini AI utility – uses process.env.GEMINI_API_KEY (server-side only).
 * Never exposes the key to the client.
 */
import { GoogleGenAI } from "@google/genai";

function cleanEnv(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return value.replace(/\s+#.*$/, "").trim() || undefined;
}

function getClient() {
  const apiKey = cleanEnv(process.env.GEMINI_API_KEY);
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in .env");
  }
  return new GoogleGenAI({ apiKey });
}

const MODEL = cleanEnv(process.env.GEMINI_MODEL) || "gemini-2.0-flash";

export async function askGemini(prompt: string): Promise<string> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });
  return response.text ?? "";
}
