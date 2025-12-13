import pool from "../config/databaseConnection";
import { IBook, IUserWithBooks, CreateBookBody } from "../types/bookTypes";
import { formatBooks } from "../utils/bookUtils";
import { BASE_QUERY } from "../utils/bookUtils";

export class Book {
  static async getBooks(
    page: number,
    limit: number,
    currentUserId?: string,
    currentUserRole?: string
  ): Promise<IBook[]> {
    try {
      const offset = (page - 1) * limit;

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
        WHERE b.is_active = TRUE
        GROUP BY 
    b.id, b.title, b.description, b.published_date, b.pages, b.price, b.cover_image_url, b.state
        ORDER BY b.title ASC
        LIMIT $1 OFFSET $2
      `;

      const result = await pool.query(query, [limit, offset]);

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
        WHERE b.id = $1 AND b.is_active = TRUE
        GROUP BY 
    b.id, b.title, b.description, b.published_date, b.pages, b.price, b.cover_image_url, b.state`;

      const result = await pool.query(query, [book_id]);

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

      // Insert Authors
      for (const author_id of data.author_ids) {
        await client.query(
          `INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)`,
          [book_id, author_id]
        );
      }

      // Insert genres
      for (const genre_id of data.genre_ids) {
        await client.query(
          `INSERT INTO book_genres(book_id, genre_id) VALUES ($1, $2)`,
          [book_id, genre_id]
        );
      }

      await client.query("COMMIT");

      const formattedQuery = `${BASE_QUERY} WHERE b.id = $1 ORDER BY ub.created_at DESC`;
      const fullResult = await pool.query(formattedQuery, [book_id]);

      const books = formatBooks(fullResult.rows);

      return books[0];
    } catch (error: any) {
      await client.query("ROLLBACK");
      throw new Error("Failed to create book");
    } finally {
      client.release();
    }
  }

  static async updateBook(book_id: string, data: any) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      // Update main book data
      await client.query(
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

      // Update genres
      if (data.genres?.length) {
        await client.query(`DELETE FROM book_genres WHERE book_id = $1`, [
          book_id,
        ]);

        for (const g of data.genres) {
          await client.query(
            `INSERT INTO book_genres (book_id, genre_id) VALUES ($1, $2)`,
            [book_id, g.genre_id]
          );
        }
      }

      // Update authors
      if (data.authors?.length) {
        await client.query(`DELETE FROM book_authors WHERE book_id = $1`, [
          book_id,
        ]);

        for (const a of data.authors) {
          await client.query(
            `INSERT INTO book_authors (book_id, author_id) VALUES ($1, $2)`,
            [book_id, a.author_id]
          );
        }
      }

      // Update user_books status if present
      const userBook = data.user_books?.[0];
      if (userBook?.user_book_id && userBook?.status) {
        await this.updateUserBookStatusInternal(
          client,
          userBook.user_book_id,
          userBook.status
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

  static async deleteBook(book_id: string): Promise<boolean> {
    try {
      // 1. Check current state
      const check = await pool.query(`SELECT state FROM books WHERE id = $1`, [
        book_id,
      ]);

      if (check.rows.length === 0) throw new Error("Book not found");

      if (check.rows[0].state === "borrowed") {
        throw new Error("Cannot delete a borrowed book");
      }

      // 2. Soft delete
      const result = await pool.query(
        `UPDATE books SET is_active = FALSE WHERE id = $1 RETURNING id AS book_id`,
        [book_id]
      );

      return result.rows.length > 0;
    } catch (error: any) {
      console.error("Error soft deleting book:", error.message);
      throw new Error("Failed to soft delete book");
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
        `SELECT state FROM books WHERE id = $1 AND is_active = TRUE`,
        [book_id]
      );

      if (bookCheck.rows.length === 0) {
        throw new Error("Book not found");
      }

      if (bookCheck.rows[0].state === "booked") {
        throw new Error("Book is already borrowed!");
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
      FROM books b
      LEFT JOIN book_authors ba ON ba.book_id = b.id
      LEFT JOIN authors a ON ba.author_id = a.id
      LEFT JOIN book_genres bg ON bg.book_id = b.id
      LEFT JOIN genres g ON bg.genre_id = g.id
      LEFT JOIN user_books ub ON ub.book_id = b.id
      LEFT JOIN users u ON ub.user_id = u.id 
      WHERE ub.user_id = $1
        AND ub.status != 'deleted'
        AND b.is_active = TRUE
      GROUP BY 
        b.id, b.title, b.description, b.published_date, b.pages, b.price, b.cover_image_url, b.state
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

  static async getUsersWithBooks(): Promise<IUserWithBooks[]> {
    const query = `
    SELECT
      u.id AS user_id,
      u.username,
      u.email,
      u.role,

      COALESCE(
        JSON_AGG(
          DISTINCT jsonb_build_object(
            'book_id', b.id,
            'title', b.title,
            'description', b.description,
            'published_date', b.published_date,
            'pages', b.pages,
            'state', b.state,
            'user_book', jsonb_build_object(
              'user_book_id', ub.id,
              'status', ub.status,
              'created_at', ub.created_at
            ),
            'authors', COALESCE(authors_agg.authors, '[]'::json),
            'genres', COALESCE(genres_agg.genres, '[]'::json)
          )
        ) FILTER (WHERE b.id IS NOT NULL),
        '[]'
      ) AS books

    FROM users u
    LEFT JOIN user_books ub ON u.id = ub.user_id
    LEFT JOIN books b ON ub.book_id = b.id AND b.is_active = TRUE

    LEFT JOIN (
      SELECT
        ba.book_id,
        JSON_AGG(
          DISTINCT jsonb_build_object(
            'author_id', a.id,
            'name', a.name,
            'birth_year', a.birth_year
          )
        ) AS authors
      FROM book_authors ba
      JOIN authors a ON ba.author_id = a.id
      GROUP BY ba.book_id
    ) authors_agg ON authors_agg.book_id = b.id

    LEFT JOIN (
      SELECT
        bg.book_id,
        JSON_AGG(
          DISTINCT jsonb_build_object(
            'genre_id', g.id,
            'name', g.name
          )
        ) AS genres
      FROM book_genres bg
      JOIN genres g ON bg.genre_id = g.id
      GROUP BY bg.book_id
    ) genres_agg ON genres_agg.book_id = b.id

    GROUP BY u.id
    ORDER BY u.username ASC;
  `;

    const { rows } = await pool.query(query);

    // ✅ Result is already correctly formatted
    return rows.map((row) => ({
      user_id: row.user_id,
      username: row.username,
      email: row.email,
      role: row.role,
      books: row.books ?? [],
    }));
  }

  // HELPER METHODS
  static async findUserBookById(user_book_id: string) {
    const result = await pool.query(
      `SELECT id, user_id, book_id, status 
     FROM user_books 
     WHERE id = $1`,
      [user_book_id]
    );

    return result.rows[0] || null;
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
}
