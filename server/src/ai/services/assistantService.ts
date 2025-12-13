import { executeQuery } from "../../utils/databaseHelper";
import { formatAssistantResponse } from "../formatters/responseFormatter";
import { parseQuestionToSQL } from "../parsers/queryParser";
import { querySQLFromLLM } from "./llmService";

export const handleAssistantQuestion = async (question: string) => {
  const trimmed = question.trim();

  //Try rule based approach first
  let sql = parseQuestionToSQL(trimmed);
  let method: "rule-based" | "ai-powered" = "rule-based";
  console.log(trimmed, "Trimmed question");
  console.log(sql, "Rule based");

  //If rule based fails, use AI
  if (!sql) {
    sql = await querySQLFromLLM(trimmed);
    method = "ai-powered";
  }
  if (!sql) {
    console.error(
      "[AI Service] Could not extract valid SQL from OpenAI response"
    );
    return null;
  }
  //If still no SQL, return error with suggestions
  if (!sql) {
    return {
      success: false,
      error: "Sorry, I couldn't understand your question.",
      suggestions: [
        "Who owns the most books?",
        "Which is the most popular book?",
        "Show the 5 most expensive books",
        "How many books are in the library?",
        "List all genres",
        "Show all authors",
        "What are the cheapest books?",
        "Who has the least books?",
      ],
    };
  }

  console.log("[AI Service] Generated SQL:", sql);

  //Return result from database
  const results = await executeQuery(sql);

  return formatAssistantResponse(trimmed, results, method);
};
