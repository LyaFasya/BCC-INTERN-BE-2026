import 'dotenv/config'
import { GoogleGenAI } from "@google/genai"

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

export const predictionFood = async ({
  food_name,
  category_name,
  storage_location,
  purchase_date,
  initial_weight,
  unit_of_weight
}) => {
  try {
    const prompt = `
You are a food validation and expiration prediction AI.

Data Provided:
- Food Name: ${food_name}
- Category Name: ${category_name}
- Storage Location: ${storage_location}
- Purchase Date: ${purchase_date}
- Weight: ${initial_weight} ${unit_of_weight}

Your task:
1. Verify if the inputted Food Name is actually a recognizable, real food item or ingredient.
2. Verify if the inputted Food Name logically belongs to the provided Category Name.
3. If valid, predict its shelf life in days.

Rules:
- If the Food Name is NOT a real food item (e.g., non-edible items, random strings, electronics, tools), return exactly:
{
  "error": "'${food_name}' is not a valid food item."
}

- If the Food Name is a valid food item but does NOT belong to the given Category Name ('${category_name}'), return exactly:
{
  "error": "'${food_name}' does not belong to the category '${category_name}'."
}

- If the Food Name is valid AND matches the category, calculate a REALISTIC expiration date.
  - CRITICAL RULES for Expiration:
    - Assess storage location rigorously: 'room_temperature' drastically reduces shelf life for fresh items (e.g., meats, dairy, milk spoil in 1-2 days at room temperature).
    - Assume items are FRESH (not canned/UHT) unless specifically stated.
    - Do NOT generate overly optimistic expiration dates (e.g., fresh milk does not last 9 months, even in a fridge).
    - Give a conservative, safe estimate.

Return exactly:
{
  "expiry_date": "YYYY-MM-DD",
  "shelf_life_days": <number>
}

IMPORTANT:
- Output strictly valid JSON.
- Do NOT include markdown blocks (\`\`\`json).
- Do NOT include any explanations.
`

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    })

    let text = response.text.trim()
    text = text.replace(/```json/g, "").replace(/```/g, "").trim()

    let parsed

    try {
      parsed = JSON.parse(text)
    } catch (err) {
      console.error("JSON parse error:", text)
      return { error: "AI response was not valid JSON." }
    }

    if (parsed.error) {
      return { error: parsed.error }
    }

    return {
      expiry_date: parsed.expiry_date || null,
      shelf_life_days: parsed.shelf_life_days || 3
    }

  } catch (error) {
    console.error("Gemini error:", error.message || error)
    return { error: "Layanan Validasi AI sedang tidak tersedia atau terkendala. Silakan coba lagi nanti." }
  }
}