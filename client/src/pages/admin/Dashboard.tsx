import { useEffect, useState } from "react";
import type { IBook } from "../../types/bookTypes";
import {
  Box,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AdminBookTable from "../../components/admin/AdminBookTable";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { fetchBooks, searchBooks } from "../../store/thunks/bookThunks";
import { clearSearch } from "../../store/slices/bookSlice";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { books, loading } = useAppSelector((state) => state.books);
  const { searchResults, isSearching } = useAppSelector((s) => s.books);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(clearSearch());
    dispatch(fetchBooks({ page: 1, limit: 10 }));
  }, [dispatch]);

  const displayedBooks = isSearching ? searchResults : books || [];

  const handleRowClick = (book: IBook) => {
    navigate(`/dashboard/books/${book.book_id}`);
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() === "") {
      dispatch(clearSearch());
    } else {
      dispatch(searchBooks({ genre: searchTerm }));
    }
  };

  return (
    <>
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
          <AdminBookTable books={displayedBooks} onRowClick={handleRowClick} />
        )}
      </Container>
    </>
  );
};

export default Dashboard;
