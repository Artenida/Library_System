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
  const [publishedDate, setPublishedDate] = useState("");
  const [pages, setPages] = useState("");
  const [price, setPrice] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const [authorIds, setAuthorIds] = useState<string[]>([]);
  const [genreIds, setGenreIds] = useState<string[]>([]);

  useEffect(() => {
    if (!book) return;

    setTitle(book.title);
    setDescription(book.description || "");
    setPublishedDate(
      book.published_date
        ? new Date(book.published_date).toISOString().split("T")[0]
        : ""
    );
    setPages(book.pages ?? "");
    setPrice(book.price ?? "");
    setCoverImage(book.cover_image_url || "");

    setAuthorIds(book.authors?.map((a) => a.author_id) || []);
    setGenreIds(book.genres?.map((g) => g.genre_id) || []);
  }, [book]);

  const handleSave = () => {
    if (!book) return;

    const updatedAuthors = authorsList.filter((a) =>
      authorIds.includes(a.author_id)
    );

    const updatedGenres = genresList.filter((g) =>
      genreIds.includes(g.genre_id)
    );

    onSave({
      ...book,
      title,
      description,
      published_date: new Date(publishedDate).toISOString(),
      pages,
      price,
      cover_image_url: coverImage,
      authors: updatedAuthors,
      genres: updatedGenres,
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
            required
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
            onChange={(e) => setPublishedDate(e.target.value)}
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
            <InputLabel>Authors</InputLabel>
            <Select
              multiple
              value={authorIds}
              onChange={(e) =>
                setAuthorIds(e.target.value as string[])
              }
              renderValue={(selected) =>
                authorsList
                  .filter((a) => selected.includes(a.author_id))
                  .map((a) => a.name)
                  .join(", ")
              }
            >
              {authorsList.map((a) => (
                <MenuItem key={a.author_id} value={a.author_id}>
                  {a.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Genres</InputLabel>
            <Select
              multiple
              value={genreIds}
              onChange={(e) =>
                setGenreIds(e.target.value as string[])
              }
              renderValue={(selected) =>
                genresList
                  .filter((g) => selected.includes(g.genre_id))
                  .map((g) => g.name)
                  .join(", ")
              }
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
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!title || !authorIds.length || !genreIds.length}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditBookModal;