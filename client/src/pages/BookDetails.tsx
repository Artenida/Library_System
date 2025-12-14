import { useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Chip,
  Button,
  Stack,
  Divider,
  Container,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { borrowBook, fetchBookDetails } from "../store/thunks/bookThunks";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PagesIcon from "@mui/icons-material/MenuBook";
import PriceIcon from "@mui/icons-material/AttachMoney";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { book, loading, error } = useAppSelector((state) => state.books);
  const userRole = useAppSelector((state) => state.auth.user?.role);

  useEffect(() => {
    if (id) dispatch(fetchBookDetails(id));
  }, [id, dispatch]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!book) return <Typography>No book found</Typography>;

  const isFree = book.state === "free";

  const handleTakeBook = async () => {
    if (!book || !book.book_id) {
      console.error("Cannot borrow: book or book_id is missing");
      return;
    }

    try {
      const from_date = new Date().toISOString();
      const to_date = "";

      await dispatch(
        borrowBook({ book_id: book.book_id, from_date, to_date })
      ).unwrap();

      dispatch(fetchBookDetails(book.book_id));

      console.log("Book borrowed successfully!");
    } catch (error) {
      console.error("Failed to borrow book:", error);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f7f7f7", minHeight: "100vh" }}>
      <Container sx={{ mt: 3, mb: 3 }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "row" }}
          gap={4}
          p={4}
          bgcolor="#fff"
          borderRadius={2}
          boxShadow="0 4px 10px rgba(0,0,0,0.1)"
        >
          {/* Cover Image */}
          <Box flexShrink={0}>
            {book.cover_image_url ? (
              <img
                src={book.cover_image_url}
                alt={book.title}
                style={{
                  width: 260,
                  height: 420,
                  objectFit: "cover",
                  borderRadius: 12,
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                }}
              />
            ) : (
              <Box
                width={260}
                height={360}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="#e0e0e0"
                borderRadius={2}
              >
                <Typography variant="body2">No Image</Typography>
              </Box>
            )}
          </Box>

          {/* Book Info */}
          <Box flexGrow={1}>
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "#3f51b5" }}
            >
              {book.title}
            </Typography>

            <Stack direction="row" spacing={1} mb={2}>
              <Chip
                icon={isFree ? <CheckCircleIcon /> : <HourglassEmptyIcon />}
                label={isFree ? "Free" : "Waiting"}
                color={isFree ? "success" : "warning"}
                size="medium"
              />
            </Stack>

            <Typography
              variant="body1"
              mb={3}
              sx={{ lineHeight: 1.7, color: "#555" }}
            >
              {book.description}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Stack spacing={1.5} mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <CalendarTodayIcon fontSize="small" />
                <Typography variant="body2">
                  Published:{" "}
                  {book.published_date
                    ? new Date(book.published_date).toLocaleDateString()
                    : "N/A"}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <PagesIcon fontSize="small" />
                <Typography variant="body2">Pages: {book.pages}</Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <PriceIcon fontSize="small" />
                <Typography variant="body2">Price: ${book.price}</Typography>
              </Box>

              {book.authors && book.authors.length > 0 && (
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" fontWeight={500}>
                    Authors:
                  </Typography>
                  <Typography variant="body2">
                    {book.authors.map((a) => a.name).join(", ")}
                  </Typography>
                </Box>
              )}

              {book.genres && book.genres.length > 0 && (
                <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
                  <Typography variant="body2" fontWeight={500}>
                    Genres:
                  </Typography>
                  {book.genres.map((g: any) => (
                    <Chip key={g.genre_id} label={g.name} size="small" />
                  ))}
                </Box>
              )}
            </Stack>

            {/* Take Book Button – only for users */}
            {userRole === "user" && (
              <Box mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!isFree}
                  sx={{ px: 4, py: 1.5, fontWeight: 600 }}
                  onClick={handleTakeBook}
                >
                  Take Book
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BookDetails;
