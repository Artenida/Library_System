import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DATABASE_SCHEMA = `
Database Schema:
- users (id uuid, username varchar(50), email varchar(100), password_hash varchar(255), role varchar(10))
- books (id uuid, title varchar(255), description text, published_date date, pages integer, price numeric(10,2), cover_image_url varchar(255), state varchar(20))
- authors (id uuid, name varchar(100), birth_year integer)
- genres (id uuid, name varchar(50)
- book_authors (book_id uuid, author_id uuid) - many-to-many relationship
- book_genres (book_id uuid, genre_id uuid) - many-to-many relationship
- user_books (id uuid, user_id uuid, book_id uuid, status varchar(20), created_at timestamp)

Relationships:
- book_authors.book_id → books.id
- book_authors.author_id → authors.id
- book_genres.book_id → books.id
- book_genres.genre_id → genres.id
- user_books.user_id → users.id
- user_books.book_id → books.id

Notes:
- Books can have multiple authors (use book_authors join table)
- Books can have multiple genres (use book_genres join table)
- Users own books through user_books table
- Book state: 'free', 'borrowed'
- User_Books status: 'reading', 'completed', 'returned', 'deleted', etc.
`;

interface HuggingFaceResponse {
  generated_text?: string;
  error?: string;
}

export async function queryAI(question: string): Promise<string | null> {
  if (!OPENAI_API_KEY) {
    console.error("[AI Service] OPENAI_API_KEY not found in environment");
    return null;
  }

  try {
    const prompt = `${DATABASE_SCHEMA}

    Task: Convert this natural language question into a PostgreSQL query.
    Question: "${question}"

    Requirements:
    1. Return ONLY the SQL query, nothing else
    2. Use proper JOINs when needed
    3. Include relevant columns
    4. Use appropriate LIMIT clauses
    5. No explanations, just SQL

    SQL Query:`;

    console.log("[AI Service] Querying OpenAI...");

    const response = await client.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        { role: "system", content: "You are a SQL assistant." },
        { role: "user", content: prompt },
      ],
    });

    const text = response.choices?.[0]?.message?.content;
    if (!text) {
      console.error("[AI Service] No text returned from OpenAI");
      return null;
    }

    const sql = extractSQL(text);

    if (!sql) {
      console.error(
        "[AI Service] Could not extract valid SQL from OpenAI response"
      );
      return null;
    }

    console.log("[AI Service] Generated SQL:", sql);
    return sql;
  } catch (error: any) {
    console.error("[AI Service] Error:", error.message);
    return null;
  }
}

function extractSQL(text: string): string | null {
  let sql = text.trim();
  sql = sql.replace(/```sql\n?/gi, "").replace(/```\n?/g, "");
  const selectMatch = sql.match(/SELECT[\s\S]*?(?:;|$)/i);
  if (selectMatch) sql = selectMatch[0].trim();
  if (!sql.toLowerCase().includes("select")) return null;
  sql = sql.replace(/;+$/, "").trim();

  // safety
  const dangerous = [
    "drop",
    "delete",
    "insert",
    "update",
    "alter",
    "create",
    "truncate",
  ];
  for (const keyword of dangerous) {
    if (sql.toLowerCase().includes(keyword)) return null;
  }

  // optional: add LIMIT if missing
  if (!sql.toLowerCase().includes("limit")) {
    sql += " LIMIT 50";
  }

  return sql;
}
