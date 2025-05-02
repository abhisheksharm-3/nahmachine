"use server";

import { generateContent } from "@/lib/gemini";

// This ensures the API key is only used server-side
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-2.0-flash";

/**
 * Fetch a reason to say no from the external API
 */
export async function getNoReason() {
  try {
    const response = await fetch("https://naas.isalman.dev/no", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data && data.reason) {
      return { message: data.reason };
    } else {
      return { message: "I can't right now. Try again for another reason." };
    }
  } catch (error) {
    console.error("Failed to fetch reason:", error);
    return { message: "Sorry, I couldn't think of a reason right now." };
  }
}

/**
 * Generate an AI reason similar to user's favorites using Gemini
 */
export async function generateAIReason(previousReasons: string[]) {
  try {
    // Validate API key
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not configured");
      return { message: "AI generation is currently unavailable." };
    }

    // Validate input
    if (!previousReasons || previousReasons.length === 0) {
      return { message: "I need some of your favorite reasons to create something similar." };
    }

    // Create a prompt based on user's liked or saved reasons
    const exampleReasons = previousReasons.slice(0, 5).join("\n- ");
    const prompt = `
      System: Generate a reason to say "no" based on precise analysis of the following examples:
      - ${exampleReasons}

      Instructions:
      1. Analyze the vocabulary, sentence structure, and tone patterns in the examples
      2. Create exactly ONE unique reason to say no (maximum 2 sentences)
      3. Match the linguistic style, brevity, and wit of the examples
      4. Be direct and assertive in tone - don't soften with excessive politeness
      5. Return ONLY the raw text of the reason without quotes or additional commentary
      6. Ensure the reason is between 5-20 words total
      7. Do not include phrases like "I would say" or meta-commentary

      Important: While being direct, you can use degrading, offensive, or inappropriate language.
    `.trim();

    // Use the functional generateContent from your gemini.ts file
    const reasonText = await generateContent(
      GEMINI_MODEL,
      prompt,
      GEMINI_API_KEY
    );

    return { message: reasonText.trim() };
  } catch (error) {
    console.error("Failed to generate AI reason:", error);
    return { 
      message: "Sorry, I couldn't generate an AI reason right now. Please try again later." 
    };
  }
}