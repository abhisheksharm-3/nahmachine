import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

let geminiInstance: GoogleGenerativeAI | null = null;

export function getGeminiInstance(apiKey: string): GoogleGenerativeAI {
  if (!geminiInstance) {
    geminiInstance = new GoogleGenerativeAI(apiKey);
  }
  return geminiInstance;
}

export async function generateContent(
  model: string,
  prompt: string,
  apiKey: string
): Promise<string> {
  try {
    const genAI = getGeminiInstance(apiKey);
    const genModel = genAI.getGenerativeModel({ 
      model,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });
    
    const result = await genModel.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    throw new Error("Failed to generate content with AI");
  }
}
