
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function estimateTask(taskTitle: string) {
  const prompt = `Analyze this task for a Pomodoro timer: "${taskTitle}". 
  Estimate the complexity and provide:
  1. Recommended number of 25-minute Pomodoro sessions.
  2. Total estimated duration in minutes.
  
  Format the response as a JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pomodoros: {
              type: Type.INTEGER,
              description: "Number of recommended Pomodoro sessions (standard 25m)",
            },
            totalMinutes: {
              type: Type.INTEGER,
              description: "Total duration in minutes",
            },
            reasoning: {
              type: Type.STRING,
              description: "Brief explanation of the estimation",
            }
          },
          required: ["pomodoros", "totalMinutes", "reasoning"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("AI Estimation Error:", error);
    return {
      pomodoros: 1,
      totalMinutes: 25,
      reasoning: "Gagal menghubungkan ke AI. Menggunakan estimasi standar."
    };
  }
}
