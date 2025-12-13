import pool from "../config/databaseConnection";
import { BASE_QUERY, formatBooks } from "../utils/bookUtils";

export class BookFilters {
  static async getBooksByGenre(genreName: string) {
    const client = await pool.connect();

    try {
      const query = `
        ${BASE_QUERY}
        FROM books b
        LEFT JOIN book_authors ba ON ba.book_id = b.id
        LEFT JOIN authors a ON ba.author_id = a.id
        LEFT JOIN book_genres bg ON bg.book_id = b.id
        LEFT JOIN genres g ON bg.genre_id = g.id
        LEFT JOIN user_books ub 
        ON ub.book_id = b.id 
        AND ub.status IN ('reading', 'completed')
        LEFT JOIN users u ON ub.user_id = u.id 
        WHERE b.is_active = TRUE AND LOWER(g.name) = LOWER($1)
        GROUP BY 
          b.id, b.title, b.description, b.published_date, b.pages, b.price, b.cover_image_url, b.state
        ORDER BY b.title ASC
      `;

      const result = await client.query(query, [genreName]);
      return formatBooks(result.rows);
    } catch (err) {
      console.error("Error filtering books by genre:", err);
      throw err;
    } finally {
      client.release();
    }
  }
}
