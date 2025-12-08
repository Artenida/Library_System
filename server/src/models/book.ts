import pool from "../config/databaseConnection";

export interface IBook {
  book_id?: string;
  title: string;
  published_date: number;
  status?: "free" | "booked";
  user?:
    | { user_id: string; name: string; email: string; role: string }[]
    | null;
  authors?: { author_id: string; name: string; birth_year: number }[];
  genres?: { genre_id: string; name: string }[];
}

export interface CreateBookBody {
  title: string;
  description?: string;
  published_date?: string;
  pages?: number;
  price?: number;
  cover_image_url?: string;
  state?: string;
  author_ids: string[];
  genre_ids: string[];
}

const BASE_QUERY = `SELECT b.id AS book_id, b.title, b.description, b.published_date, b.pages, b.price, b.cover_image_url, b.state,
                    ub.id AS user_book_id, ub.status, ub.created_at, ub.from_date, ub.to_date,
                    u.id AS user_id, u.username, u.email, u.role,
                    a.id AS author_id, a.name AS author_name, a.birth_year,
                    g.id AS genre_id, g.name AS genre_name
                    
                    FROM books b
                    LEFT JOIN user_books ub ON ub.book_id = b.id
                    LEFT JOIN users u ON ub.user_id = u.id
                    LEFT JOIN book_authors ba ON ba.book_id = b.id
                    LEFT JOIN authors a ON ba.author_id = a.id
                    LEFT JOIN book_genres bg ON bg.book_id = b.id
                    LEFT JOIN genres g ON bg.genre_id = g.id`;

const formatBooks = (
  rows: any[],
  currentUserId?: string,
  currentUserRole?: string
): IBook[] => {
  const map = new Map<string, IBook>();

  rows.forEach((row) => {
    const book_id = row.book_id;

    if (!map.has(book_id)) {
      map.set(book_id, {
        book_id: book_id,
        title: row.title,
        published_date: row.published_date,
        status: row.state,
        user: [],
        authors: [],
        genres: [],
      });
    }

    const book = map.get(book_id)!;

    if (row.user_id) {
      if (currentUserRole === "admin" || row.user_id === currentUserId) {
        // Admin sees all user info
        const exists = book.user!.some((u) => u.user_id === row.user_id);
        if (!exists) {
          book.user!.push({
            user_id: row.user_id,
            name: row.username,
            email: row.email,
            role: row.role,
          });
        }
      } else {
        // Normal users see only the user_id
        const exists = book.user!.some((u) => u.user_id === row.user_id);
        if (!exists) {
          book.user!.push({
            user_id: row.user_id,
            name: "", // Hide name
            email: "", // Hide email
            role: "", // Hide role
          });
        }
      }
    }

    if (row.author_id) {
      const exists = book.authors!.some((a) => a.author_id === row.author_id);
      if (!exists) {
        book.authors!.push({
          author_id: row.author_id,
          name: row.author_name,
          birth_year: row.author_birth_year,
        });
      }
    }

    if (row.genre_id) {
      const exists = book.genres!.some((g) => g.genre_id === row.genre_id);
      if (!exists) {
        book.genres!.push({
          genre_id: row.genre_id,
          name: row.genre_name,
        });
      }
    }
  });

  return Array.from(map.values());
};

export class Book {
  static async getBooks(
    page: number,
    limit: number,
    currentUserId?: string,
    currentUserRole?: string
  ): Promise<IBook[]> {
    try {
      const offset = (page - 1) * limit; // Calculate offset for pagination

      const query =
        BASE_QUERY +
        ` ORDER BY b.title ASC, ub.created_at DESC LIMIT $1 OFFSET $2`;

      const result = await pool.query(query, [limit, offset]);
      if (!result || !result.rows) {
        console.warn("No rows returned from getBooks()");
        return [];
      }

      const books = formatBooks(result.rows, currentUserId, currentUserRole);
      if (books.length === 0) {
        console.warn("No books found in DB");
      }

      return books;
    } catch (error: any) {
      console.error("Error retrieving books:", error.message);
      throw new Error("Failed to retrieve books");
    }
  }

  static async getSingleBook(
    book_id: string,
    currentUserId?: string,
    currentUserRole?: string
  ): Promise<IBook | null> {
    try {
      if (!book_id) {
        console.warn("getSingleBook called without book_id");
        return null;
      }

      const query = BASE_QUERY + ` WHERE b.id = $1 ORDER BY ub.created_at DESC`;

      const result = await pool.query(query, [book_id]);

      if (!result || !result.rows || result.rows.length === 0) {
        console.warn(`Book not found for id: ${book_id}`);
        return null;
      }

      const books = formatBooks(result.rows, currentUserId, currentUserRole);

      return books[0] ?? null;
    } catch (error: any) {
      console.error("Error retrieving book:", error.message);
      throw new Error("Failed to retrieve single book");
    }
  }

  static async createBook(data: CreateBookBody): Promise<IBook> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      if (!data.title) {
        throw new Error("Title is required");
      }
      if (!data.author_ids || data.author_ids.length === 0) {
        throw new Error("At least one author is required");
      }
      if (!data.genre_ids || data.genre_ids.length === 0) {
        throw new Error("At least one genre is required");
      }

      const insertBookQuery = `INSERT INTO books (title, description, published_date, pages, price, cover_image_url, state) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id AS book_id, *`;

      const bookValues = [
        data.title,
        data.description ?? null,
        data.published_date ?? null,
        data.pages ?? null,
        data.price ?? null,
        data.cover_image_url ?? null,
        data.state ?? "free",
      ];

      const bookResult = await client.query(insertBookQuery, bookValues);
      const createdBook = bookResult.rows[0];
      const book_id = createdBook.book_id;

      for (const author_id of data.author_ids) {
        await client.query(
          `INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)`,
          [book_id, author_id]
        );
      }

      for (const genre_id of data.genre_ids) {
        await client.query(
          `INSERT INTO book_genres(book_id, genre_id) VALUES ($1, $2)`,
          [book_id, genre_id]
        );
      }

      await client.query("COMMIT");

      const formattedQuery =
        BASE_QUERY + ` WHERE b.id = $1 ORDER BY ub.created_at DESC`;
      const fullResult = await pool.query(formattedQuery, [book_id]);
      const books = formatBooks(fullResult.rows);

      return books[0];
    } catch (error: any) {
      await client.query("ROLLBACK");
      console.error("Error creating book:", error.message);
      throw new Error("Failed to create book");
    } finally {
      client.release();
    }
  }

  static async deleteBook(book_id: string): Promise<boolean> {
    try {
      if (!book_id) {
        throw new Error("Book ID is required");
      }

      const result = await pool.query(
        `DELETE FROM books WHERE id = $1 RETURNING id AS book_id`,
        [book_id]
      );
      return result.rows.length > 0;
    } catch (error: any) {
      console.error("Error deleting book:", error.message);
      throw new Error("Failed to delete book");
    }
  }

  static async updateUserBookStatusInternal(
    client: any,
    user_book_id: string,
    status: string
  ) {
    // 1. Update user_books
    const result = await client.query(
      `UPDATE user_books
     SET status = $1
     WHERE id = $2
     RETURNING book_id`,
      [status, user_book_id]
    );

    if (result.rowCount === 0) {
      throw new Error("user_books row not found");
    }

    const book_id = result.rows[0].book_id;

    // 2. Determine state
    const newState =
      status === "reading" || status === "completed" ? "borrowed" : "free";

    // 3. Update book state
    await client.query(`UPDATE books SET state = $1 WHERE id = $2`, [
      newState,
      book_id,
    ]);
  }

  static async getUserBookById(user_book_id: string) {
    const result = await pool.query(
      `SELECT id, user_id, book_id, status 
     FROM user_books 
     WHERE id = $1`,
      [user_book_id]
    );

    return result.rows[0] || null;
  }

  static async updateUserBookStatus(user_book_id: string, status: string) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await this.updateUserBookStatusInternal(client, user_book_id, status);

      await client.query("COMMIT");
      return { success: true };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async updateBookCore(client: any, book_id: string, data: any) {
    return client.query(
      `UPDATE books
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          published_date = COALESCE($3, published_date),
          pages = COALESCE($4, pages),
          price = COALESCE($5, price),
          cover_image_url = COALESCE($6, cover_image_url),
          state = COALESCE($7, state)
     WHERE id = $8`,
      [
        data.title || null,
        data.description || null,
        data.published_date || null,
        data.pages || null,
        data.price || null,
        data.cover_image_url || null,
        data.state || null,
        book_id,
      ]
    );
  }

  static async updateBookGenres(
    client: any,
    book_id: string,
    genre_ids: string[]
  ) {
    await client.query(`DELETE FROM book_genres WHERE book_id = $1`, [book_id]);

    for (const genre_id of genre_ids) {
      await client.query(
        `INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2)`,
        [book_id, genre_id]
      );
    }
  }

  static async updateBookAuthors(
    client: any,
    book_id: string,
    author_ids: string[]
  ) {
    await client.query(`DELETE FROM book_authors WHERE book_id = $1`, [
      book_id,
    ]);

    for (const author_id of author_ids) {
      await client.query(
        `INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)`,
        [book_id, author_id]
      );
    }
  }

  static async updateBook(book_id: string, data: any) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Update main book data
      if (
        data.title ||
        data.description ||
        data.published_date ||
        data.pages ||
        data.price ||
        data.cover_image_url ||
        data.state
      ) {
        await this.updateBookCore(client, book_id, data);
      }

      // Update genres
      if (data.genre_ids) {
        await this.updateBookGenres(client, book_id, data.genre_ids);
      }

      // Update authors
      if (data.author_ids) {
        await this.updateBookAuthors(client, book_id, data.author_ids);
      }

      // Update user_books (user-specific status)
      if (data.user_book_status && data.user_book_id) {
        await this.updateUserBookStatusInternal(
          client,
          data.user_book_id,
          data.user_book_status
        );
      }

      await client.query("COMMIT");
    } catch (error: any) {
      await client.query("ROLLBACK");
      throw new Error("Failed to update book: " + error.message);
    } finally {
      client.release();
    }
  }

  static async borrowBook(
    user_id: string,
    book_id: string,
    from_date: string,
    to_date?: string
  ) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Check if the book exists and is free
      const bookCheck = await client.query(
        `SELECT state FROM books WHERE id = $1`,
        [book_id]
      );

      if (bookCheck.rows.length === 0) {
        throw new Error("Book not found");
      }

      if (bookCheck.rows[0].state === "booked") {
        throw new Error("Book is already borrowed!");
      }

      //Check if the user already borrowed the same book
      const existing = await client.query(
        `SELECT id FROM user_books 
        WHERE user_id = $1 AND book_id = $2
        AND status IN ('reading')`,
        [user_id, book_id]
      );

      if (existing.rows.length > 0) {
        throw new Error("User already has this book in reading status");
      }

      //Assign book to user
      const userBookInsert = await client.query(
        `INSERT INTO user_books (user_id, book_id, status, from_date, to_date)
        VALUES ($1, $2, 'reading', $3, $4)
        RETURNING *`,
        [user_id, book_id, from_date, to_date || null]
      );

      //Update book state
      await client.query(`UPDATE books SET state = 'borrowed' WHERE id = $1`, [
        book_id,
      ]);

      await client.query("COMMIT");

      return userBookInsert.rows[0];
    } catch (error: any) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  static async getBooksByUser(user_id: string) {
    try {
      const query = `
      ${BASE_QUERY}
      WHERE ub.user_id = $1
        AND ub.status != 'deleted'
      ORDER BY ub.created_at DESC
    `;

      const result = await pool.query(query, [user_id]);

      if (!result.rows || result.rows.length === 0) {
        return [];
      }

      return formatBooks(result.rows, user_id, "user");
    } catch (error: any) {
      console.error("Error retrieving user books:", error.message);
      throw new Error("Failed to retrieve user books");
    }
  }
}
