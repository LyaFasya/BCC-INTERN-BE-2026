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
Predict how long a food item will last based on realistic food storage knowledge.

Food data:
- Food name: ${food_name}
- Storage location: ${storage_location} (freezer, refrigerator, room_temperature)
- Purchase date: ${purchase_date}
- Weight: ${initial_weight} ${unit_of_weight}

Instructions:
- Analyze the type of food (e.g., meat, vegetables, dairy, cooked food, dry food, etc.)
- Consider storage conditions:
  - Freezer → longest shelf life
  - Refrigerator → medium shelf life
  - Room temperature → shortest shelf life
- Estimate shelf life based on common real-world food storage standards
- Adjust estimation slightly based on weight (larger quantities may last slightly longer if stored properly)
- Use reasonable and realistic ranges (e.g., milk 5–7 days in fridge, raw chicken 1–2 days, frozen meat weeks/months, etc.)

Rules:
- If the given "food_name" is NOT a food item (e.g., electronics, objects, or invalid input), respond with:
{
  "error": "Invalid food item"
}
- If required data is missing or invalid, respond with:
{
  "error": "Invalid input"
}

Output requirements:
- Calculate:
  1. Estimated shelf life (in days)
  2. Expiry date based on purchase date + shelf life
- Respond ONLY in JSON format
- Do NOT include explanation or extra text
- JSON must be valid

Valid response format:
{
  "expiry_date": "YYYY-MM-DD",
  "shelf_life_days": number
}
`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview",
      contents: prompt,
    })

    let text = response.text.trim()
    text = text.replace(/```json/g, "").replace(/```/g, "").trim()
    let parsed

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
    console.error("Gemini error:", error.message)
    return {
      expiry_date: null,
      shelf_life_days: 3
    }
  }
}