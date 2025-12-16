import pool from "../config/databaseConnection";

export interface IGenre {
  genre_id?: string;
  name: string;
}

export class Genre {
  static async getGenres(): Promise<IGenre[]> {
    try {
      const query = `SELECT id AS genre_id, name FROM genres ORDER BY name ASC`;
      const result = await pool.query(query);

      if (!result || !result.rows) {
        throw new Error("Database did not return valid results!");
      }

      return result.rows;
    } catch (error: any) {
      console.error("Error retrieving genres:", error.message);
      throw new Error("Error fetching genres: " + error.message);
    }
  }

  static async createGenre(name: string): Promise<IGenre> {
    if (!name) {
      throw new Error("Genre name is required.");
    }

    try {
      const query = `
        INSERT INTO genres (name)
        VALUES ($1)
        RETURNING id AS genre_id, name
      `;
      const result = await pool.query(query, [name]);
      return result.rows[0];
    } catch (error: any) {
      console.error("Error creating genre:", error.message);
      throw new Error("Error creating genre: " + error.message);
    }
  }

  static async updateGenre(genre_id: string, name: string): Promise<IGenre> {
    if (!genre_id || !name) {
      throw new Error("Both genre_id and name are required!");
    }

    try {
      const query = `
        UPDATE genres
        SET name = $1
        WHERE id = $2
        RETURNING id AS genre_id, name
      `;
      const result = await pool.query(query, [name, genre_id]);

      if (result.rowCount === 0) {
        throw new Error("Genre not found!");
      }

      return result.rows[0];
    } catch (error: any) {
      console.error("Error updating genre:", error.message);
      throw new Error(error.message);
    }
  }

  static async deleteGenre(genre_id: string): Promise<void> {
    if (!genre_id) {
      throw new Error("Genre ID is required!");
    }

    try {
      // Check if the genre is linked to any books
      const checkQuery = `SELECT COUNT(*) FROM book_genres WHERE genre_id = $1`;
      const checkResult = await pool.query(checkQuery, [genre_id]);

      if (parseInt(checkResult.rows[0].count) > 0) {
        throw new Error("Cannot delete genre: Genre is associated with books!");
      }

      // Delete the genre
      const deleteQuery = `DELETE FROM genres WHERE id = $1`;
      const result = await pool.query(deleteQuery, [genre_id]);

      if (result.rowCount === 0) {
        throw new Error("Genre not found!");
      }
    } catch (error: any) {
      console.error("Error deleting genre:", error.message);
      throw new Error(error.message);
    }
  }

  static async getBooksByGenreId(genre_id: string) {
    if (!genre_id) {
      throw new Error("Genre ID is required!");
    }

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
        b.state
      FROM books b
      INNER JOIN book_genres bg ON bg.book_id = b.id
      WHERE bg.genre_id = $1
      ORDER BY b.title ASC
    `;

      const result = await pool.query(query, [genre_id]);

      return result.rows;
    } catch (error: any) {
      console.error("Error retrieving books for genre:", error.message);
      throw new Error("Error fetching books for genre: " + error.message);
    }
  }
}
