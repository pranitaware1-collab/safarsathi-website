import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getTravelRecommendations(destination: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 3 smart travel recommendations for ${destination}. 
      Focus on hidden gems, local food, and cultural tips. 
      Format as a JSON array of objects with 'id', 'title', and 'description'.`,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
}
