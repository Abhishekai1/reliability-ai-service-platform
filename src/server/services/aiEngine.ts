import { GoogleGenAI } from "@google/genai";

export class AIEngine {
  private ai: GoogleGenAI | null = null;

  private getClient(): GoogleGenAI | null {
    if (this.ai) return this.ai;

    const envKey = process.env.GEMINI_API_KEY;
    const hardcodedKey = "AIzaSyC5-GjGK-lqbQzMDAutMs-_fiXse4fHKIk";
    
    const isPlaceholder = (key: string | undefined) => 
      !key || 
      key === "MY_GEMINI_API_KEY" || 
      key === "TODO_KEYHERE" || 
      key === "GEMINI_API_KEY" ||
      key.trim() === "" ||
      key.includes("YOUR_API_KEY");

    // Prioritize environment key if it's NOT a placeholder
    // Otherwise fallback to the hardcoded key
    const apiKey = !isPlaceholder(envKey) ? envKey! : hardcodedKey;

    if (apiKey) {
      try {
        this.ai = new GoogleGenAI({ apiKey });
        return this.ai;
      } catch (err) {
        console.error("Failed to initialize GoogleGenAI client:", err);
        return null;
      }
    }
    
    return null;
  }

  async generateResponse(query: string): Promise<string> {
    const client = this.getClient();
    
    if (!client) {
      return `[MOCK] This is a simulated response to your query: "${query}". (Reason: No valid API key could be initialized)`;
    }

    try {
      const response = await client.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
      });
      
      if (!response.text) {
        return "I'm sorry, the AI returned an empty response.";
      }
      
      return response.text;
    } catch (error: any) {
      console.error("AI Engine Error Details:", error);
      
      const errorMsg = error.message || "";
      if (errorMsg.includes("API key not valid") || errorMsg.includes("INVALID_ARGUMENT") || errorMsg.includes("400")) {
        return `[MOCK] API Key Error: The key was rejected by Google. Falling back to simulation for: "${query}"`;
      }
      
      return `[MOCK] AI Engine encountered an error: ${errorMsg}. Falling back to simulation for: "${query}"`;
    }
  }
}

export const aiEngine = new AIEngine();
