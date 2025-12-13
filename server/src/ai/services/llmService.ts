import OpenAI from "openai";
import { INSIGHTS_PROMPT } from "../prompts/insightsPrompt";
import { SQL_PROMPT } from "../prompts/sqlPrompts";
import { parseAIInsights } from "../formatters/insightsFormatter";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const querySQLFromLLM = async (
  question: string
): Promise<string | null> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        { role: "system", content: "You are a SQL assistant." },
        { role: "user", content: SQL_PROMPT(question) },
      ],
    });
    console.log(response, "OpenAI result")

    const text = response.choices[0].message?.content || "";
    return extractSafeSQL(text);
  } catch {
    return null;
  }
};

export const generateInsightsFromLLM = async (
  bookList: string,
  username: string
) => {
  const response = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages: [{ role: "user", content: INSIGHTS_PROMPT(bookList, username) }],
  });

  const raw = response.choices[0].message?.content || "";
  return parseAIInsights(raw);
};

function extractSafeSQL(text: string): string | null {
  let sql = text.replace(/```sql|```/gi, "").trim();
  if (!sql.toLowerCase().startsWith("select")) return null;

  const forbidden = ["drop", "delete", "insert", "update", "alter", "truncate"];
  if (forbidden.some((k) => sql.toLowerCase().includes(k))) return null;

  if (!sql.toLowerCase().includes("limit")) sql += " LIMIT 50";

  return sql;
}
