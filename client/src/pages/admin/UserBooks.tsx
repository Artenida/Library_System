import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import LibraryTable from "../../components/user/UserLibraryTable";
import { Typography, CircularProgress } from "@mui/material";
import { fetchUserBooks } from "../../store/thunks/bookThunks";

const UserBooks = () => {
  const { userId } = useParams();
  const dispatch = useAppDispatch();
  const { books, loading } = useAppSelector((state) => state.books);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserBooks(userId));
    }
  }, [dispatch, userId]);

  if (loading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h5" mb={2}>
        User Books
      </Typography>
      <LibraryTable books={books} />
    </>
  );
};

export default UserBooks;
