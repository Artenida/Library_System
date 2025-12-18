import { executeQuery } from "../../utils/databaseHelper";
import { formatAssistantResponse } from "../formatters/responseFormatter";
import { parseQuestionToSQL } from "../parsers/queryParser";
import { querySQLFromLLM } from "./llmService";

export const handleAssistantQuestion = async (question: string) => {
  const trimmed = question.trim();

  //Try rule based approach first
  let sql = parseQuestionToSQL(trimmed);
  let method: "rule-based" | "ai-powered" = "rule-based";

  //If rule based fails, use AI
  if (!sql) {
    sql = await querySQLFromLLM(trimmed);
    method = "ai-powered";
  }
  if (!sql) {
    console.error(
      "[AI Service] Could not extract valid SQL from OpenAI response"
    );
    return {
      success: false,
      error: "Sorry, I couldn't understand your question.",
    };
  }

  console.log("[AI Service] Generated SQL:", sql);

  //Return result from database
  const results = await executeQuery(sql);

  if (method === "rule-based") {
    return formatAssistantResponse(trimmed, results, method);
  }

  return {
    question: trimmed,
    answer: "Here are the results based on your question.",
    data: results,
    count: results.length,
    method,
    tableHeaders: results.length > 0 ? Object.keys(results[0]) : [],
  };
};
