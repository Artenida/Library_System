export interface IBook {
  book_id?: string;
  title: string;
  description: string;
  published_date: number;
  pages: string;
  price: string;
  cover_image_url: string;
  state?: "free" | "borrowed";
  user?:
    | { user_id: string; name: string; email: string; role: string }[]
    | null;
  authors?: { author_id: string; name: string; birth_year: number }[];
  genres?: { genre_id: string; name: string }[];
}