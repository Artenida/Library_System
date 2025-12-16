import pool from "../config/databaseConnection";

export interface IAuthor {
  author_id?: string;
  name: string;
  birth_year: number;
}

export class Author {
  static async getAuthors() {
    try {
      const query = `SELECT id AS author_id, name, birth_year FROM authors ORDER BY name ASC`;
      const result = await pool.query(query);

      if (!result || !result.rows) {
        throw new Error("Database did not return valid results!");
      }

      return result.rows;
    } catch (error: any) {
      console.error("Error retrieving authors: ", error.message);
      throw new Error("Error fetching authors: " + error.message);
    }
  }

  static async createAuthor(
    name: string,
    birth_year: number
  ): Promise<IAuthor> {
    if (!name || !birth_year) {
      throw new Error("Both name and birth year are required.");
    }

    try {
      const query = `INSERT INTO authors (name, birth_year) VALUES ($1, $2) RETURNING id AS author_id, name, birth_year`;
      const result = await pool.query(query, [name, birth_year]);
      return result.rows[0];
    } catch (error: any) {
      throw new Error("Error creating author: " + error.message);
    }
  }

  static async updateAuthor(
    author_id: string,
    name: string,
    birth_year: number
  ): Promise<IAuthor> {
    if (!author_id) {
      throw new Error("Author ID is required!");
    }

    try {
      const query = `UPDATE authors SET name = $1, birth_year= $2 WHERE id = $3 RETURNING id as author_id, name, birth_year`;
      const result = await pool.query(query, [name, birth_year, author_id]);
      if (result.rowCount === 0) {
        throw new Error("Author not found!");
      }
      return result.rows[0];
    } catch (error: any) {
      console.error("Error updating author:", error.message);
      throw new Error(error.message);
    }
  }

  static async deleteAuthor(author_id: string): Promise<void> {
    if (!author_id) {
      throw new Error("Author id is required!");
    }

    try {
      // Check if the author is linked to any books
      const checkQuery = `SELECT COUNT(*) FROM book_authors WHERE author_id = $1`;
      const checkResult = await pool.query(checkQuery, [author_id]);

      if (parseInt(checkResult.rows[0].count) > 0) {
        throw new Error("Cannot delete author: Author has associated books!");
      }

      // Delete the author
      const deleteQuery = `DELETE FROM authors WHERE id = $1`;
      const result = await pool.query(deleteQuery, [author_id]);

      if (result.rowCount === 0) {
        throw new Error("Author not found!");
      }
    } catch (error: any) {
      console.error("Error deleting author:", error.message);
      throw new Error(error.message);
    }
  }

  static async getBooksByAuthorId(author_id: string) {
    if (!author_id) {
      throw new Error("Author ID is required!");
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
      INNER JOIN book_authors ba ON ba.book_id = b.id
      WHERE ba.author_id = $1
      ORDER BY b.title ASC
    `;

      const result = await pool.query(query, [author_id]);

      return result.rows;
    } catch (error: any) {
      console.error("Error retrieving books for author:", error.message);
      throw new Error("Error fetching books for author: " + error.message);
    }
  }
}
