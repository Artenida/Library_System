import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateInsights(
  bookListSummary: string,
  username: string
): Promise<string> {
  try {
    const prompt = `
        You are a library assistant. Based on the following user reading data, provide a short summary and insights for ${username}:

        ${bookListSummary}

        Summarize this user's reading habits, favorite genres, typical book length, and provide 2-3 actionable insights. 
        Respond in plain text.
        `;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [{ role: "user", content: prompt }],
    });

    // Return the generated text
    return completion.choices[0].message?.content?.trim() || "";
  } catch (error: any) {
    console.error("[AI Insights Service] Error:", error.message);
    return "No insights could be generated.";
  }
}
