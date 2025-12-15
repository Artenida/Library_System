import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Typography, CircularProgress } from "@mui/material";
import type { IBook } from "../../types/bookTypes";
import { getAuthorBooksThunk } from "../../store/thunks/authorThunks";
import BooksTable from "../../components/admin/BooksTable";

const AuthorBooks = () => {
  const { author_id } = useParams();
  const dispatch = useAppDispatch();
  const { books, loading } = useAppSelector((state) => state.author);

  useEffect(() => {
    if (author_id) {
      dispatch(getAuthorBooksThunk(author_id));
    }
  }, [dispatch, author_id]);

  const handleEdit = (book: IBook) => {
    console.log("Edit book:", book);
  };

  const handleDelete = (book: IBook) => {
    console.log("Delete book:", book.book_id);
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h5" mb={2}>
        Books by this Author
      </Typography>

      {books.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No books found for this author.
        </Typography>
      ) : (
        <BooksTable
          books={books}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRowClick={(book) => console.log("Book clicked:", book)}
        />
      )}
    </>
  );
};

export default AuthorBooks;
