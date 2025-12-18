import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Typography, CircularProgress } from "@mui/material";
import { fetchUserBooks, updateBook } from "../../store/thunks/bookThunks";
import OrdersTable from "../../components/user/OrdersTable";
import type { IBook } from "../../types/bookTypes";

const UserBooks = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { books, loading } = useAppSelector((state) => state.books);
  if (!id) {
    return "Please provide the id of the book!";
  }

  useEffect(() => {
    dispatch(fetchUserBooks(id));
  }, [dispatch]);

  const handleEdit = async (updatedBook: IBook) => {
    try {
      await dispatch(updateBook(updatedBook)).unwrap();

      dispatch(fetchUserBooks(id));
    } catch (error) {
      console.error("Failed to update book:", error);

      window.alert(String(error));
    }
  };

  const handleDelete = async (book: IBook) => {
    try {
      const deletedBook: IBook = {
        ...book,
        user_books: book.user_books?.map((ub) => ({
          ...ub,
          status: "deleted",
        })),
      };

      await dispatch(updateBook(deletedBook)).unwrap();

      dispatch(fetchUserBooks(id));
    } catch (error) {
      console.error("Failed to soft delete book:", error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h5" mb={2}>
        User Books
      </Typography>
      {books.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          This user does not have any books.
        </Typography>
      ) : (
        <OrdersTable
          books={books}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default UserBooks;
