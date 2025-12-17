export interface IBook {
  book_id?: string;
  title: string;
  description: string;
  published_date: string;
  pages: string;
  price: string;
  cover_image_url: string;
  state?: "free" | "borrowed";
  user?:
    | { user_id: string; name: string; email: string; role: string }[]
    | null;
  user_books?:
    | {
        user_book_id: string;
        status: "" | "reading" | "completed" | "returned" | "deleted";
        created_at: string;
        from_date: string;
        to_date: string;
      }[]
    | null;
  authors?: { author_id: string; name: string; birth_year: number }[];
  genres?: { genre_id: string; name: string }[];
}

export interface IUserWithBooks {
  user_id: string;
  username: string;
  email: string;
  role: "user" | "admin";

  books: IUserBookWithDetails[];
}

export interface IUserBookWithDetails {
  user_book_id: string;
  status: string;
  created_at: string;

  book: IBookDetails;
}

export interface IBookDetails {
  book_id: string;
  title: string;
  description: string;
  published_date: number;
  pages: number;
  state: "free" | "borrowed" | "deleted";

  authors: IAuthorInfo[];
  genres: IGenreInfo[];
}

export interface IAuthorInfo {
  author_id: string;
  name: string;
  birth_year: number;
}

export interface IGenreInfo {
  genre_id: string;
  name: string;
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
