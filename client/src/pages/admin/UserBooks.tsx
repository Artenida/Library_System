import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Typography, CircularProgress } from "@mui/material";
import { fetchUserBooks } from "../../store/thunks/bookThunks";
import OrdersTable from "../../components/user/OrdersTable";
import type { IBook } from "../../types/bookTypes";

const UserBooks = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { books, loading } = useAppSelector((state) => state.books);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserBooks(id));
    }
  }, [dispatch, id]);

  const handleEdit = async (updatedBook: IBook) => {
    console.log("Sending to backend:", updatedBook);
  };

  const handleDelete = async (book: IBook) => {
    console.log("Soft deleting book:", book.book_id);
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
