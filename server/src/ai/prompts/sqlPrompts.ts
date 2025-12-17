const DATABASE_SCHEMA = `
Database Schema:
- users (id uuid, username varchar(50), email varchar(100), password_hash varchar(255), role varchar(10))
- books (id uuid, title varchar(255), description text, published_date date, pages integer, price numeric(10,2), cover_image_url varchar(255), state varchar(20), is_active varchar(20))
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
- Book state: 'free', 'borrowed' 'deleted'
- Book is_active: 'true', 'false'
- User_Books status: 'reading', 'completed', 'returned', 'deleted', etc.
`;

export const SQL_PROMPT = (question: string): string => {
  return `${DATABASE_SCHEMA}

    Task: Convert this natural language question into a PostgreSQL query.
    Question: "${question}"

    Requirements:
    1. Return ONLY the SQL query, nothing else
    2. Use proper JOINs when needed
    3. Include relevant columns
    4. Use appropriate LIMIT clauses
    5. Don't use lower function

    SQL Query:`;
};

console.log("[AI Service] Querying OpenAI...");
