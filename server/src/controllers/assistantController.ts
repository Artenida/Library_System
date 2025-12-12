import { Request, Response } from "express";
import { parseQuestionToSQL } from "../utils/queryParser";
import { executeQuery } from "../utils/databaseHelper";
import { formatAssistantResponse } from "../utils/responseFormatter";
import { queryAI } from "../utils/aiService";
import { User } from "../models/user";
import { generateInsights } from "../utils/aiInsightsService";

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
      console.log("[AI Assistant] Using OpenAI API...");
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

export const askInsights = async (req: any, res: any) => {
  try {
    const userName = req.query.user_name as string;

    if (!userName || userName.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "user_name query parameter is required",
      });
    }

    const users = await User.findUsersByName(userName);
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    const userId = users[0].id;

    const sql = `
      SELECT 
        b.title,
        b.pages,
        b.state,
        STRING_AGG(DISTINCT g.name, ', ') as genres
      FROM user_books ub
      LEFT JOIN books b ON ub.book_id = b.id
      LEFT JOIN book_genres bg ON b.id = bg.book_id
      LEFT JOIN genres g ON bg.genre_id = g.id
      WHERE ub.user_id = '${userId}'
      GROUP BY b.id, b.title, b.pages, b.state
    `;

    const userBooks = await executeQuery(sql);

    if (!userBooks || userBooks.length === 0) {
      return res.json({
        success: true,
        insights: "No reading data available for this user.",
      });
    }

    // Prepare a prompt for OpenAI
    const bookListSummary = userBooks
      .map((b: any) => `${b.title} (${b.pages} pages, genres: ${b.genres})`)
      .join("\n");

    const summary = await generateInsights(bookListSummary, users[0].username);

    return res.json({
      success: true,
      insights: summary || "No insights could be generated.",
      data: userBooks,
    });
  } catch (error: any) {
    console.error("[Library Insights] Error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to generate insights",
    });
  }
};
