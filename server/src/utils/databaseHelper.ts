import pool from "../config/databaseConnection";

export async function executeQuery(sql: string): Promise<any[]> {
  try {
    // Safety check - only allow SELECT queries
    if (!sql.trim().toLowerCase().startsWith("select")) {
      throw new Error("Only SELECT queries are allowed");
    }

    const result = await pool.query(sql);
    return result.rows;
  } catch (error: any) {
    console.error("[Database Helper] Query execution error:", error.message);
    throw new Error(`Database query failed: ${error.message}`);
  }
}