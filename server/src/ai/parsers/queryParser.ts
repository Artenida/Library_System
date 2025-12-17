export function parseQuestionToSQL(question: string): string | null {
  const lower = question.toLowerCase().trim();

  // "Who owns the most books?"
  if (
    (lower.includes("who") || lower.includes("which user")) &&
    lower.includes("most") &&
    lower.includes("books")
  ) {
    return `
      SELECT 
        u.id,
        u.username,
        u.email,
        COUNT(ub.id) as book_count
      FROM users u
      LEFT JOIN user_books ub 
        ON ub.user_id = u.id AND ub.status IN ('reading', 'completed')
      GROUP BY u.id, u.username, u.email
      ORDER BY book_count DESC
      LIMIT 1
    `;
  }

  // "Which is the most popular book?"
  if (
    (lower.includes("most popular") || lower.includes("top book")) &&
    lower.includes("book")
  ) {
    return `
      SELECT 
        b.id,
        b.title,
        b.price,
        b.published_date,
        STRING_AGG(DISTINCT a.name, ', ') as authors,
        STRING_AGG(DISTINCT g.name, ', ') as genres
      FROM books b
      LEFT JOIN book_authors ba ON b.id = ba.book_id
      LEFT JOIN authors a ON ba.author_id = a.id
      LEFT JOIN book_genres bg ON b.id = bg.book_id
      LEFT JOIN genres g ON bg.genre_id = g.id
      GROUP BY b.id, b.title, b.price, b.published_date
      ORDER BY b.pages DESC
      LIMIT 1
    `;
  }

  // "Who has the least/fewest books?"
  if (
    (lower.includes("who") || lower.includes("which user")) &&
    (lower.includes("least") || lower.includes("fewest")) &&
    lower.includes("books")
  ) {
    return `
      SELECT 
        u.id,
        u.username,
        u.email,
        COUNT(ub.id) as book_count
      FROM users u
      LEFT JOIN user_books ub ON ub.user_id = u.id AND ub.status IN ('reading', 'completed')
      GROUP BY u.id, u.username, u.email
      HAVING COUNT(ub.id) > 0
      ORDER BY book_count ASC
      LIMIT 1
    `;
  }

  // "What books are available?" / "Show available books"
  if (lower.includes("available") && lower.includes("book")) {
    return `
      SELECT 
        b.id,
        b.title,
        b.price,
        b.state,
        STRING_AGG(DISTINCT a.name, ', ') as authors
      FROM books b
      LEFT JOIN book_authors ba ON b.id = ba.book_id
      LEFT JOIN authors a ON ba.author_id = a.id
      WHERE b.state = 'free' AND b.is_active = TRUE
      GROUP BY b.id, b.title, b.price, b.state
      ORDER BY b.title
      LIMIT 20
    `;
  }

  // No pattern matched
  return null;
}
