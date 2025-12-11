import { IBook } from "../types/bookTypes";

export const BASE_QUERY = `SELECT b.id AS book_id, b.title, b.description, b.published_date, b.pages, b.price, b.cover_image_url, b.state,
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

export const formatBooks = (
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
        description: row.description,
        published_date: row.published_date,
        state: row.state,
        pages: row.pages,
        price: row.price,
        cover_image_url: row.cover_image_url,
        user: [],
        user_books: [],
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
          birth_year: row.birth_year,
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

    if (row.user_book_id) {
      const exists = book.user_books!.some(
        (ub) => ub.user_book_id === row.user_book_id
      );

      if (!exists) {
        if (currentUserRole === "admin" || row.user_id === currentUserId) {
          book.user_books!.push({
            user_book_id: row.user_book_id,
            status: row.status,
            created_at: row.created_at,
            from_date: row.from_date,
            to_date: row.to_date,
          });
        } else {
          book.user_books!.push({
            user_book_id: "",
            status: "",
            created_at: "",
            from_date: "",
            to_date: "",
          });
        }
      }
    }
  });

  return Array.from(map.values());
};
