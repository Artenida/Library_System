import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Typography, CircularProgress } from "@mui/material";
import { getGenreBooksThunk } from "../../store/thunks/genreThunks";
import BooksTable from "../../components/admin/BooksTable";

const GenreBooks = () => {
  const { genre_id } = useParams();
  const dispatch = useAppDispatch();
  const { books, loading } = useAppSelector((state) => state.genre);

  useEffect(() => {
    if (genre_id) {
      dispatch(getGenreBooksThunk(genre_id));
    }
  }, [dispatch, genre_id]);

  if (loading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h5" mb={2}>
        Books in this Genre
      </Typography>

      {books.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No books found for this genre.
        </Typography>
      ) : (
        <BooksTable
          books={books}
          onRowClick={(book) => console.log("Book clicked:", book)}
        />
      )}
    </>
  );
};

export default GenreBooks;
