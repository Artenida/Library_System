export function parseQuestionToSQL(question: string): string | null {
  const lower = question.toLowerCase().trim();

  //"Who owns the most books?"
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
      LEFT JOIN user_books ub ON ub.user_id = u.id
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

  // "Show the five most expensive books"
  const expensiveMatch = lower.match(
    /(?:show\s+)?(?:the\s+)?(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\s+most\s+expensive/
  );
  if (expensiveMatch) {
    const numberMap: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5,
      six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    };
    const limit = numberMap[expensiveMatch[1]] || parseInt(expensiveMatch[1]) || 5;

    return `
      SELECT 
        b.id,
        b.title,
        b.price,
        b.published_date,
        STRING_AGG(DISTINCT a.name, ', ') as authors
      FROM books b
      LEFT JOIN book_authors ba ON b.id = ba.book_id
      LEFT JOIN authors a ON ba.author_id = a.id
      GROUP BY b.id, b.title, b.price, b.published_date
      ORDER BY b.price DESC
      LIMIT ${limit}
    `;
  }

  // "Show the cheapest books"
  const cheapestMatch = lower.match(
    /(?:show\s+)?(?:the\s+)?(\d+|one|two|three|four|five|six|seven|eight|nine|ten)?\s*(?:cheapest|least expensive)/
  );
  if (cheapestMatch) {
    const numberMap: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5,
      six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    };
    const limit = cheapestMatch[1] 
      ? (numberMap[cheapestMatch[1]] || parseInt(cheapestMatch[1]) || 5)
      : 5;

    return `
      SELECT 
        b.id,
        b.title,
        b.price,
        b.published_date,
        STRING_AGG(DISTINCT a.name, ', ') as authors
      FROM books b
      LEFT JOIN book_authors ba ON b.id = ba.book_id
      LEFT JOIN authors a ON ba.author_id = a.id
      GROUP BY b.id, b.title, b.price, b.published_date
      ORDER BY b.price ASC
      LIMIT ${limit}
    `;
  }

  // "How many books are there?" / "Total books"
  if (
    (lower.includes("how many") && lower.includes("books")) ||
    lower.includes("total books") ||
    lower.includes("count books")
  ) {
    return `
      SELECT COUNT(*) as total_books FROM books
    `;
  }

  // "List all genres" / "Show genres"
  if (
    (lower.includes("list") || lower.includes("show")) &&
    lower.includes("genre")
  ) {
    return `
      SELECT 
        g.id,
        g.name,
        COUNT(bg.book_id) as book_count
      FROM genres g
      LEFT JOIN book_genres bg ON bg.genre_id = g.id
      GROUP BY g.id, g.name
      ORDER BY g.name
    `;
  }

  // "Show all authors" / "List authors"
  if (
    (lower.includes("list") || lower.includes("show")) &&
    lower.includes("author")
  ) {
    return `
      SELECT 
        a.id,
        a.name,
        a.birth_year,
        COUNT(ba.book_id) as book_count
      FROM authors a
      LEFT JOIN book_authors ba ON ba.author_id = a.id
      GROUP BY a.id, a.name, a.birth_year
      ORDER BY a.name
      LIMIT 20
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
      LEFT JOIN user_books ub ON ub.user_id = u.id
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
      WHERE b.state = 'free'
      GROUP BY b.id, b.title, b.price, b.state
      ORDER BY b.title
      LIMIT 20
    `;
  }

  // No pattern matched
  return null;
}