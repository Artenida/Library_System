import { User } from "../../models/user";
import { executeQuery } from "../../utils/databaseHelper";
import { generateInsightsFromLLM } from "./llmService";

export const handleUserInsights = async (userName: string) => {
  const users = await User.findUsersByName(userName);

  if(!users.length) {
    throw new Error("User not found");
  }

  const userId = users[0].id;

  const sql = `
    SELECT 
      b.title,
      b.pages,
      STRING_AGG(DISTINCT g.name, ', ') AS genres
    FROM user_books ub
    JOIN books b ON ub.book_id = b.id
    LEFT JOIN book_genres bg ON b.id = bg.book_id
    LEFT JOIN genres g ON bg.genre_id = g.id
    WHERE ub.user_id = '${userId}'
    GROUP BY b.id, b.title, b.pages
  `;

  const books = await executeQuery(sql);

  if (!books.length) {
    return { insights: "No reading data available." };
  }

  const summaryInput = books
    .map((b: any) => `${b.title} (${b.pages} pages, genres: ${b.genres})`)
    .join("\n");

  const insights = await generateInsightsFromLLM(
    summaryInput,
    users[0].username
  );

  return {
    insights,
    data: books,
  };
}