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
      const query = `DELETE FROM genres WHERE id = $1`;
      const result = await pool.query(query, [genre_id]);

      if (result.rowCount === 0) {
        throw new Error("Genre not found!");
      }
    } catch (error: any) {
      console.error("Error deleting genre:", error.message);
      throw new Error(error.message);
    }
  }
}
