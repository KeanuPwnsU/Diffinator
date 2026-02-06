import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL, SYSTEM_INSTRUCTION } from "../constants";

export async function generateGeminiSummary(oldCode: string, newCode: string): Promise<string> {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key not found in environment.");

    const ai = new GoogleGenAI({ apiKey });

    // We send the raw code. The prompt ensures Gemini acts as a diff summarizer.
    const prompt = `
Original File:
\`\`\`
${oldCode}
\`\`\`

New File:
\`\`\`
${newCode}
\`\`\`

Please provide the change summary as per your system instructions.
    `;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Low temperature for factual analysis
        maxOutputTokens: 2000,
      }
    });

    return response.text || "No summary generated.";

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `Analysis Failed: ${error.message}`;
  }
}
