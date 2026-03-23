import 'dotenv/config'
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

export const predictionFood = async ({
  food_name,
  storage_location,
  purchase_date,
  initial_weight,
  unit_of_weight
}) => {
  try {
    const prompt = `
You are a food expiration prediction AI.
Your task:
Predict how long a food item will last based on the data.
Food data:
- Food name: ${food_name}
- Storage location: ${storage_location}
- Purchase date: ${purchase_date}
- Weight: ${initial_weight} ${unit_of_weight}

Rules:
- Respond ONLY in JSON format
- Do NOT include explanation, no extra text.
- JSON must be valid
Format:
{
  "expiry_date": "YYYY-MM-DD",
  "shelf_life_days": number
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    })

    let text = response.text.trim();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim()
    let parsed;

    try {
      parsed = JSON.parse(text)
    } catch (err) {
      console.error("JSON parse error:", text)
      return {
        expiry_date: null,
        shelf_life_days: 3
      }
    }
    return {
      expiry_date: parsed.expiry_date || null,
      shelf_life_days: parsed.shelf_life_days || 3
    }
  } catch (error) {
    console.error("Gemini error:", error.message);
    return {
      expiry_date: null,
      shelf_life_days: 3
    }
  }
}