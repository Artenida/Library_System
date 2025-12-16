import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import type { IBook } from "../../types/bookTypes";
import { useAppSelector } from "../../store/hooks";

interface Props {
  open: boolean;
  onClose: () => void;
  book: IBook | null;
  onSave: (updatedBook: IBook) => void;
}

const EditBookModal = ({ open, onClose, book, onSave }: Props) => {
  const authorsList = useAppSelector((state) => state.author.authors);
  const genresList = useAppSelector((state) => state.genre.genres);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishedDate, setPublishedDate] = useState(0);
  const [pages, setPages] = useState("");
  const [price, setPrice] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [state, setState] = useState<"free" | "borrowed">("free");
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>("");
  const [selectedGenreId, setSelectedGenreId] = useState<string>("");

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setDescription(book.description || "");
      setPublishedDate(book.published_date);
      setPages(book.pages);
      setPrice(book.price);
      setCoverImage(book.cover_image_url || "");
      setState(book.state ?? "free");
      setSelectedAuthorId(book.authors?.[0]?.author_id || "");
      setSelectedGenreId(book.genres?.[0]?.genre_id || "");
    }
  }, [book]);

  const handleSave = () => {
    if (!book) return;

    const selectedAuthor = authorsList.find(
      (a) => a.author_id === selectedAuthorId
    );
    const selectedGenre = genresList.find(
      (g) => g.genre_id === selectedGenreId
    );

    onSave({
      ...book,
      title,
      description,
      published_date: publishedDate,
      pages,
      price,
      cover_image_url: coverImage,
      state,
      authors: selectedAuthor ? [selectedAuthor] : [],
      genres: selectedGenre ? [selectedGenre] : [],
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Book</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Published Date"
            type="date"
            fullWidth
            value={publishedDate}
            onChange={(e) => setPublishedDate(Number(e.target.value))}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Pages"
            type="number"
            fullWidth
            value={pages}
            onChange={(e) => setPages(e.target.value)}
          />
          <TextField
            label="Price"
            type="number"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <TextField
            label="Cover Image URL"
            fullWidth
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />
          <FormControl fullWidth>
            <InputLabel>State</InputLabel>
            <Select
              value={state}
              onChange={(e) => setState(e.target.value as "free" | "borrowed")}
            >
              <MenuItem value="free">Free</MenuItem>
              <MenuItem value="borrowed">Borrowed</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Author</InputLabel>
            <Select
              value={selectedAuthorId}
              onChange={(e) => setSelectedAuthorId(e.target.value)}
            >
              {authorsList.map((a) => (
                <MenuItem key={a.author_id} value={a.author_id}>
                  {a.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Genre</InputLabel>
            <Select
              value={selectedGenreId}
              onChange={(e) => setSelectedGenreId(e.target.value)}
            >
              {genresList.map((g) => (
                <MenuItem key={g.genre_id} value={g.genre_id}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBookModal;
