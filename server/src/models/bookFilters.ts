import pool from "../config/databaseConnection";

export class BookFilters {
  static async getBooksByGenre(genreName: string) {
    const client = await pool.connect();

    try {
      const query = `
        SELECT
            b.id AS book_id,
            b.title,
            b.description,
            b.published_date,
            b.pages,
            b.price,
            b.cover_image_url,
            b.state,

            -- User info from user_books
            json_agg(
            DISTINCT jsonb_build_object(
                'user_book_id', ub.id,
                'status', ub.status,
                'from_date', ub.from_date,
                'to_date', ub.to_date,
                'created_at', ub.created_at,
                'user', jsonb_build_object(
                'user_id', u.id,
                'username', u.username,
                'email', u.email,
                'role', u.role
                )
            )
            ) FILTER (WHERE ub.id IS NOT NULL) AS users,

            -- Authors
            json_agg(
            DISTINCT jsonb_build_object(
                'author_id', a.id,
                'name', a.name,
                'birth_year', a.birth_year
            )
            ) FILTER (WHERE a.id IS NOT NULL) AS authors,

            -- Genres
            json_agg(
            DISTINCT jsonb_build_object(
                'genre_id', g.id,
                'name', g.name
            )
            ) FILTER (WHERE g.id IS NOT NULL) AS genres

        FROM books b
        LEFT JOIN user_books ub ON ub.book_id = b.id
        LEFT JOIN users u ON ub.user_id = u.id
        LEFT JOIN book_authors ba ON ba.book_id = b.id
        LEFT JOIN authors a ON ba.author_id = a.id
        LEFT JOIN book_genres bg ON bg.book_id = b.id
        LEFT JOIN genres g ON bg.genre_id = g.id

        WHERE LOWER(g.name) = LOWER($1)

        GROUP BY b.id
        ORDER BY b.title ASC
        `;
      const result = await client.query(query, [genreName]);
      return result.rows;
    } catch (err) {
      console.error("Error filtering books by genre:", err);
      throw err;
    } finally {
      client.release();
    }
  }
}
