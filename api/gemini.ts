
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Only allow POST requests for security and data handling
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { prompt, config } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  // The API key is obtained exclusively from the environment variable as per requirements
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured in the environment.' });
  }

  // Initialize the Gemini client within the serverless context
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    // Using gemini-3-pro-preview for complex reasoning tasks like curriculum planning
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: config,
    });

    // Return the generated text by accessing the .text property directly (not a method)
    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
}
