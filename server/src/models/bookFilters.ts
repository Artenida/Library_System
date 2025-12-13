import pool from "../config/databaseConnection";
import { BASE_QUERY, formatBooks } from "../utils/bookUtils";

export class BookFilters {
  static async getBooksByGenre(genreName: string) {
    const client = await pool.connect();

    try {
      const query = `
        ${BASE_QUERY}
        WHERE LOWER(g.name) = LOWER($1)
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
