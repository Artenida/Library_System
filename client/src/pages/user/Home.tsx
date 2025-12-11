import { Box, Container, CircularProgress, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchBooks } from "../../store/thunks/bookThunks";
import LibraryTable from "../../components/LibraryTable";
import AppHeader from "../../components/AppHeader";
import { useNavigate } from "react-router-dom";
import type { IBook } from "../../types/bookTypes";

const Home = () => {
  const [activeLink, setActiveLink] = useState("Library");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { books, loading } = useAppSelector((state) => state.books);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchBooks({ page: 1, limit: 10 }));
  }, [dispatch]);

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

      <Container
        sx={{
          mt: 2,
          mb: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search genres..."
            sx={{
              bgcolor: "#fff",
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "6px",
                fontSize: "0.9rem",
              },
            }}
            onChange={(e) => console.log("Genre search:", e.target.value)}
          />
        </Box>
      </Container>

      <Container sx={{ mt: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          <LibraryTable books={books} onRowClick={handleRowClick} />
        )}
      </Container>
    </Box>
  );
};

export default Home;
