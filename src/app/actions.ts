"use server";

import { generateContent } from "@/lib/gemini";
import { 
  uniqueReasons, 
  reasonCategories, 
  type ReasonCategory 
} from "@/lib/reasons";

// This ensures the API key is only used server-side
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-2.0-flash";

/**
 * Get a creative reason to say no from our own collection
 */
export async function getNoReason() {
  try {
    // Get a random reason from our collection
    const randomIndex = Math.floor(Math.random() * uniqueReasons.length);
    const selectedReason = uniqueReasons[randomIndex];
    
    // Add a small delay to simulate API call (optional)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));
    
    return { message: selectedReason };
  } catch (error) {
    console.error("Failed to get reason:", error);
    return { message: "Nah, something went wrong and even my backup plan said no." };
  }
}

/**
 * Get multiple creative reasons at once
 */
export async function getMultipleNoReasons(count: number = 3) {
  try {
    if (count > 10) count = 10; // Limit to prevent spam
    if (count < 1) count = 1;
    
    const shuffled = [...uniqueReasons].sort(() => 0.5 - Math.random());
    const selectedReasons = shuffled.slice(0, count);
    
    // Add a small delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 50));
    
    return { messages: selectedReasons };
  } catch (error) {
    console.error("Failed to get multiple reasons:", error);
    return { messages: ["Nah, something went wrong and even my backup plans said no."] };
  }
}

/**
 * Get a reason based on a specific category/mood
 */
export async function getNoReasonByCategory(category: ReasonCategory = 'random') {
  try {
    let filteredReasons: string[] = [];
    
    if (category === 'random') {
      filteredReasons = uniqueReasons;
    } else {
      filteredReasons = reasonCategories[category] || uniqueReasons;
    }
    
    const randomIndex = Math.floor(Math.random() * filteredReasons.length);
    const selectedReason = filteredReasons[randomIndex];
    
    await new Promise(resolve => setTimeout(resolve, Math.random() * 400 + 100));
    
    return { message: selectedReason, category };
  } catch (error) {
    console.error("Failed to get categorized reason:", error);
    return { message: "Nah, my excuse generator is having technical difficulties.", category };
  }
}

/**
 * Get statistics about available reasons
 */
export async function getReasonStats() {
  try {
    const stats = {
      total: uniqueReasons.length,
      categories: Object.entries(reasonCategories).map(([name, reasons]) => ({
        name,
        count: reasons.length
      }))
    };
    
    return { stats };
  } catch (error) {
    console.error("Failed to get reason stats:", error);
    return { stats: { total: 0, categories: [] } };
  }
}

/**
 * Get all available categories
 */
export async function getAvailableCategories() {
  try {
    const categories = Object.keys(reasonCategories) as ReasonCategory[];
    return { categories: [...categories, 'random'] };
  } catch (error) {
    console.error("Failed to get categories:", error);
    return { categories: ['random'] };
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