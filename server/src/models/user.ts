import pool from "../config/databaseConnection";
import bcrypt from "bcrypt";

export interface IUser {
  id?: string;
  username: string;
  email: string;
  password_hash?: string;
  role?: string;
}

export class User {
  static async getUser(id: string): Promise<IUser> {
    try {
      const query = `SELECT id, username, email, password_hash, role FROM users WHERE id = $1`;

      const result = await pool.query(query, [id]);

      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        throw new Error("User not found");
      }
    } catch (error: any) {
      console.error("Error retrieving user: ", error.message);
      throw new Error(`Error getting user: ${error.message}`);
    }
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const query = `SELECT id, username, email, password_hash, role FROM users WHERE email = $1`;
      const result = await pool.query(query, [email]);
      if (result.rows.length === 0) return null;
      return result.rows[0];
    } catch (error: any) {
      console.error("Error fetching user by email:", error.message);
      throw new Error(error.message);
    }
  }

  static async getUsers(): Promise<IUser[]> {
    try {
      const query = `SELECT id, username, email, role FROM users`;
      const result = await pool.query(query);

      return result.rows;
    } catch (error: any) {
      console.error("Error fetching users:", error.message);
      throw new Error(error.message);
    }
  }

  static async createUser(data: IUser): Promise<IUser> {
    try {
      const hashed_password = data.password_hash
        ? await bcrypt.hash(data.password_hash, 10)
        : null;

      const result = await pool.query(
        `INSERT INTO users (username, email, password_hash, role)
            VALUES ($1,$2,$3,$4)
            RETURNING id, username, email, password_hash, role`,
        [data.username, data.email, hashed_password, data.role || "user"]
      );

      return result.rows[0];
    } catch (error: any) {
      console.error("Error creating user:", error.message);
      throw new Error(error.message);
    }
  }

  static async updateUser(id: String, data: Partial<IUser>): Promise<IUser> {
    try {
      if (data.password_hash) {
        data.password_hash = await bcrypt.hash(data.password_hash, 10);
      }

      // Dynamic SET query
      const fields = Object.keys(data);
      const values = Object.values(data);
      const setQuery = fields
        .map((f, i) => {
          if (f === "password_hash") return `password_hash=$${i + 1}`;
          return `${f} = $${i + 1}`;
        })
        .join(",");

      const result = await pool.query(
        `UPDATE users SET ${setQuery} WHERE id=$${fields.length + 1} 
            RETURNING id, username, email, password_hash, role`,
        [...values, id]
      );

      if (result.rows.length === 0) throw new Error("User not found!");
      return result.rows[0];
    } catch (error: any) {
      console.error("Error updating user:", error.message);
      throw new Error(error.message);
    }
  }

  static async deleteUser(id: String): Promise<void> {
    try {
      const result = await pool.query(
        `DELETE FROM users WHERE id = $1 RETURNING id`,
        [id]
      );

      if (result.rows.length === 0) throw new Error("User not found!");
    } catch (error: any) {
      console.error("Error deleting user:", error.message);
      throw new Error(error.message);
    }
  }

  static async findUsersByName(
    name: string
  ): Promise<{ id: string; username: string }[]> {
    const sql = `
    SELECT id, username
    FROM users
    WHERE LOWER(username) LIKE LOWER($1)
    LIMIT 20
  `;
    const values = [`%${name}%`];

    const result = await pool.query(sql, values);
    return result.rows;
  }
}
