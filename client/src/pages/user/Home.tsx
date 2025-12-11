import { Box, Container, CircularProgress, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { borrowBook, fetchBooks, searchBooks } from "../../store/thunks/bookThunks";
import LibraryTable from "../../components/LibraryTable";
import AppHeader from "../../components/AppHeader";
import { useNavigate } from "react-router-dom";
import type { IBook } from "../../types/bookTypes";
import { clearSearch } from "../../store/slices/bookSlice";

const Home = () => {
  const [activeLink, setActiveLink] = useState("Library");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { books, loading } = useAppSelector((state) => state.books);
  const { searchResults, isSearching } = useAppSelector((s) => s.books);

  const [searchTerm, setSearchTerm] = useState("");

  const displayedBooks =
    searchResults.length > 0 || isSearching ? searchResults : books || [];

  useEffect(() => {
    dispatch(fetchBooks({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleRowClick = (book: IBook) => {
    navigate(`/books/${book.book_id}`);
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() === "") {
      dispatch(clearSearch());
    } else {
      dispatch(searchBooks({ genre: searchTerm }));
    }
  };

  const handleTakeBook = async (book: IBook) => {
    try {
      const from_date = new Date().toISOString();
      const to_date = undefined;

      if (!book.book_id) return "Provide book id";

      await dispatch(
        borrowBook({ book_id: book.book_id, from_date, to_date })
      ).unwrap();

      dispatch(fetchBooks({ page: 1, limit: 10 }));
    } catch (error) {
      console.error("Failed to borrow book:", error);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f7f7f7", minHeight: "100vh" }}>
      <AppHeader activeLink={activeLink} setActiveLink={setActiveLink} />

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchClick();
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearchClick}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Container>

      <Container sx={{ mt: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          <LibraryTable
            books={displayedBooks}
            onRowClick={handleRowClick}
            onTake={handleTakeBook}
          />
        )}
      </Container>
    </Box>
  );
};

export default Home;
