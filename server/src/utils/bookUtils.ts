import { IBook } from "../types/bookTypes";

export const BASE_QUERY = `SELECT 
    b.id AS book_id,
    b.title,
    b.description,
    b.published_date,
    b.pages,
    b.price,
    b.cover_image_url,
    b.state,
    
    -- Authors as JSON array
    COALESCE(
        JSON_AGG(DISTINCT jsonb_build_object(
            'author_id', a.id,
            'name', a.name,
            'birth_year', a.birth_year
        )) FILTER (WHERE a.id IS NOT NULL),
        '[]'
    ) AS authors,
    
    -- Genres as JSON array
    COALESCE(
        JSON_AGG(DISTINCT jsonb_build_object(
            'genre_id', g.id,
            'name', g.name
        )) FILTER (WHERE g.id IS NOT NULL),
        '[]'
    ) AS genres,
    
    -- Users and user_books as JSON array
    COALESCE(
        JSON_AGG(DISTINCT jsonb_build_object(
            'user_book_id', ub.id,
            'status', ub.status,
            'created_at', ub.created_at,
            'from_date', ub.from_date,
            'to_date', ub.to_date,
            'user', jsonb_build_object(
                'user_id', u.id,
                'name', u.username,
                'email', u.email,
                'role', u.role
            )
        )) FILTER (WHERE ub.id IS NOT NULL),
        '[]'
    ) AS user_books
`;

export const formatBooks = (
  rows: any[],
  currentUserId?: string,
  currentUserRole?: string
): IBook[] => {
  return rows.map((row) => {
    // Parse JSON arrays from query
    const authors = row.authors || [];
    const genres = row.genres || [];
    const user_books_raw = row.user_books || [];

    // Process user_books with user info and role-based hiding
    const user_books = user_books_raw.map((ub: any) => {
      if (currentUserRole === "admin" || ub.user.user_id === currentUserId) {
        return {
          user_book_id: ub.user_book_id,
          status: ub.status,
          created_at: ub.created_at,
          from_date: ub.from_date,
          to_date: ub.to_date,
        };
      } else {
        return {
          user_book_id: "",
          status: "",
          created_at: "",
          from_date: "",
          to_date: "",
        };
      }
    });

    // Process users: extract unique users from user_books
    const userMap = new Map<string, any>();
    user_books_raw.forEach((ub: any) => {
      const u = ub.user;
      if (!u.user_id) return;
      if (!userMap.has(u.user_id)) {
        if (currentUserRole === "admin" || u.user_id === currentUserId) {
          userMap.set(u.user_id, {
            user_id: u.user_id,
            name: u.name,
            email: u.email,
            role: u.role,
          });
        } else {
          userMap.set(u.user_id, {
            user_id: u.user_id,
            name: "",
            email: "",
            role: "",
          });
        }
      }
    });

    return {
      book_id: row.book_id,
      title: row.title,
      description: row.description,
      published_date: row.published_date,
      state: row.state,
      pages: row.pages,
      price: row.price,
      cover_image_url: row.cover_image_url,
      authors: authors.map((a: any) => ({
        author_id: a.author_id,
        name: a.name,
        birth_year: a.birth_year,
      })),
      genres: genres.map((g: any) => ({
        genre_id: g.genre_id,
        name: g.name,
      })),
      user_books,
      user: Array.from(userMap.values()),
    } as IBook;
  });
};