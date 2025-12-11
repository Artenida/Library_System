import { useEffect, useState } from "react";
import { Box, Container, Typography, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchUserBooks, updateBook } from "../../store/thunks/bookThunks";
import OrdersTable from "../../components/OrdersTable";
import AppHeader from "../../components/AppHeader";
import { useNavigate } from "react-router-dom";
import type { IBook } from "../../types/bookTypes";

const Orders = () => {
  const [activeLink, setActiveLink] = useState("Orders");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { books, loading, error } = useAppSelector((state) => state.books);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchUserBooks());
  }, [dispatch]);

  const handleEdit = async (updatedBook: IBook) => {
    try {
      console.log("Sending to backend:", updatedBook);

      await dispatch(updateBook(updatedBook)).unwrap();

      dispatch(fetchUserBooks());
    } catch (error) {
      console.error("Failed to update book:", error);
    }
  };

  const handleDelete = async (book: IBook) => {
    try {
      console.log("Soft deleting book:", book.book_id);

      const deletedBook: IBook = {
        ...book,
        user_books: book.user_books?.map((ub) => ({
          ...ub,
          status: "deleted",
        })),
      };

      await dispatch(updateBook(deletedBook)).unwrap();

      dispatch(fetchUserBooks());
    } catch (error) {
      console.error("Failed to soft delete book:", error);
    }
  };

  const handleRowClick = (book: IBook) => {
    navigate(`/books/${book.book_id}`);
  };

  return (
    <Box sx={{ bgcolor: "#f7f7f7", minHeight: "100vh" }}>
      <AppHeader
        activeLink={activeLink}
        setActiveLink={setActiveLink}
        username={user?.username}
      />

      <Container sx={{ mt: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          My Orders
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <OrdersTable
            books={books}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRowClick={handleRowClick}
          />
        )}
      </Container>
    </Box>
  );
};

export default Orders;
