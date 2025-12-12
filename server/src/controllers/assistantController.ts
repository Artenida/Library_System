import { Request, Response } from "express";
import { parseQuestionToSQL } from "../utils/queryParser";
import { executeQuery } from "../utils/databaseHelper";
import { formatAssistantResponse } from "../utils/responseFormatter";
import { queryAI } from "../utils/aiService";

interface AssistantRequest extends Request {
  body: {
    question: string;
  };
  user?: {
    id: number;
    role: string;
  };
}

export const askAssistant = async (
  req: AssistantRequest,
  res: Response
): Promise<any> => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        success: false,
        error: "Question is required and must be a string",
      });
    }

    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length < 3) {
      return res.status(400).json({
        success: false,
        error: "Question is too short",
      });
    }

    if (trimmedQuestion.length > 500) {
      return res.status(400).json({
        success: false,
        error: "Question is too long (max 500 characters)",
      });
    }

    console.log(`[AI Assistant] Question: "${trimmedQuestion}"`);

    // Try rule-based parsing first (faster, free)
    let sql = parseQuestionToSQL(trimmedQuestion);
    let method = "rule-based";

    // If rule-based fails, use AI
    if (!sql) {
      console.log("[AI Assistant] Using Hugging Face API...");
      sql = await queryAI(trimmedQuestion);
      method = "ai-powered";
    }

    // If still no SQL, return error with suggestions
    if (!sql) {
      return res.status(400).json({
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
      });
    }

    console.log(`[AI Assistant] Generated SQL (${method}):`, sql);

    const results = await executeQuery(sql);

    const formattedResponse = formatAssistantResponse(
      trimmedQuestion,
      results,
      method
    );

    return res.json({
      success: true,
      ...formattedResponse,
    });
  } catch (error: any) {
    console.error("[AI Assistant] Error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to process your question",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
