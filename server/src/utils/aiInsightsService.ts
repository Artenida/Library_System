import OpenAI from "openai";
import { parseAIInsights } from "../utils/insightsOutputFormater";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateInsights(
  bookListSummary: string,
  username: string
): Promise<{ summary: string[]; actionable: string[] }> {
  try {
    const prompt = `
        You are a library assistant. Based on the following user reading data, provide a short summary and insights for ${username}:

        ${bookListSummary}

        Write 3-4 summary bullet points.
        Write 2-3 actionable insights.
        Use this format exactly:

        Summary:
        - point 1
        - point 2
        - point 3

        Insights:
        - actionable 1
        - actionable 2
        `;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [{ role: "user", content: prompt }],
    });

    const raw = completion.choices[0].message?.content?.trim() || "";

    return parseAIInsights(raw);
  } catch (error: any) {
    console.error("[AI Insights Service] Error:", error.message);
    return { summary: [], actionable: [] };
  }
}
