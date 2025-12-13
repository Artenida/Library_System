import { Request, Response } from "express";
import { handleUserInsights } from "../services/insightsService";
import { handleAssistantQuestion } from "../services/assistantService";

export const askAssistant = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({
        success: false,
        error: "Question is required",
      });
    }

    const results = await handleAssistantQuestion(question);

    return res.json({
      success: true,
      ...results,
    });
  } catch (error: any) {
    console.error("[Assistant Controller]", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to process question",
    });
  }
};

export const askInsights = async (req: Request, res: Response) => {
  try {
    const userName = req.query.user_name as string;

    if (!userName) {
      return res.status(400).json({
        success: false,
        error: "user_name query parameter is required",
      });
    }

    const result = await handleUserInsights(userName);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    console.error("[Insights Controller]", error.message);
    return res.status(500).json({
      success: false,
      error: "Failed to generate insights",
    });
  }
};
