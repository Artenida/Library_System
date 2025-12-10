import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Container,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchBooks } from "../../store/thunks/bookThunks";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import BookList from "../../components/BookList";

const Home = () => {
  const [activeLink, setActiveLink] = useState("Library");

  const dispatch = useAppDispatch();
  const { books, loading } = useSelector((state: RootState) => state.books);

  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchBooks({ page: 1, limit: 10 }));
  }, [dispatch]);

  return (
    <Box sx={{ bgcolor: "#f7f7f7", minHeight: "100vh" }}>
      <AppBar position="static" sx={{ bgcolor: "#fff" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              fontFamily: "'Roboto Slab', serif",
              cursor: "pointer",
            }}
          >
            Books
          </Typography>

          <Box sx={{ display: "flex", gap: 3 }}>
            {["Library", "Orders"].map((text) => (
              <Button
                key={text}
                onClick={() => setActiveLink(text)}
                sx={{
                  color: activeLink === text ? "#1976d2" : "#000",
                  textTransform: "none",
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 500,
                  borderRadius: "8px",
                  bgcolor: "inherit",
                }}
              >
                {text}
              </Button>
            ))}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 500,
                color: "#000",
              }}
            >
              {user?.username}
            </Typography>
            <Avatar
              alt="Profile"
              src="https://via.placeholder.com/40"
              sx={{
                width: 36,
                height: 36,
                cursor: "pointer",
                border: "2px solid #ffff",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

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
          <BookList books={books} userRole="user" />
        )}
      </Container>
    </Box>
  );
};

export default Home;
