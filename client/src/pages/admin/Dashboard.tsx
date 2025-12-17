import { useEffect, useState } from "react";
import type { CreateBookBody, IBook } from "../../types/bookTypes";
import {
  Box,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  CircularProgress,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import AdminBookTable from "../../components/admin/AdminBookTable";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import {
  createBook,
  deleteBook,
  fetchBooks,
  searchBooks,
  updateBook,
} from "../../store/thunks/bookThunks";
import { clearSearch } from "../../store/slices/bookSlice";
import EditBookModal from "../../components/modals/EditBookModal";
import CreateBookModal from "../../components/modals/CreateBookModal";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { books, loading } = useAppSelector((state) => state.books);
  const { searchResults, isSearching } = useAppSelector((s) => s.books);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(clearSearch());
    dispatch(fetchBooks({ page: 1, limit: 10 }));
  }, [dispatch]);

  const displayedBooks = isSearching ? searchResults : books || [];

  const handleRowClick = (book: IBook) => {
    navigate(`/dashboard/books/${book.book_id}`);
  };

  const handleCreateSave = async (newBook: CreateBookBody) => {
    try {
      await dispatch(createBook(newBook)).unwrap();
      setIsModalOpen(false);
      dispatch(fetchBooks({ page: 1, limit: 10 }));
    } catch (err) {
      alert("Failed to create book");
    }
  };

  const handleSearchClick = () => {
    if (searchTerm.trim() === "") {
      dispatch(clearSearch());
    } else {
      dispatch(searchBooks({ genre: searchTerm }));
    }
  };

  const handleEditClick = (book: IBook) => {
    setSelectedBook(book);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (book: IBook) => {
    if (!book.book_id) return;

    if (!window.confirm(`Are you sure you want to delete "${book.title}"?`))
      return;

    try {
      const resultAction = await dispatch(deleteBook(book.book_id)).unwrap();
      alert(resultAction);
      dispatch(fetchBooks({ page: 1, limit: 10 }));
    } catch (err: any) {
      alert(err);
    }
  };

  const handleEditSave = async (updatedBook: IBook) => {
    try {
      await dispatch(updateBook(updatedBook)).unwrap();
      setIsEditModalOpen(false);
      dispatch(fetchBooks({ page: 1, limit: 10 }));
    } catch (err) {
      console.error(err);
      alert("Failed to update book");
    }
  };

  return (
    <>
      <Container
        sx={{
          mt: 2,
          mb: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
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

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsModalOpen(true)}
          sx={{ alignSelf: "flex-start" }}
        >
          Create Book
        </Button>
      </Container>

      <Container sx={{ mt: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          <AdminBookTable
            books={displayedBooks}
            onRowClick={handleRowClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        )}
      </Container>

      <EditBookModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        book={selectedBook}
        onSave={handleEditSave}
      />

      <CreateBookModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateSave}
      />
    </>
  );
};

export default Dashboard;
