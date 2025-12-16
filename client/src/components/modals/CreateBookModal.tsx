import { useState } from "react";
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
import { useAppSelector } from "../../store/hooks";
import type { CreateBookBody } from "../../types/bookTypes";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (book: CreateBookBody) => void;
}

const CreateBookModal = ({ open, onClose, onSave }: Props) => {
  const authors = useAppSelector((s) => s.author.authors);
  const genres = useAppSelector((s) => s.genre.genres);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [pages, setPages] = useState("");
  const [price, setPrice] = useState("");
  const [coverImage, setCoverImage] = useState("");

  const [authorIds, setAuthorIds] = useState<string[]>([]);
  const [genreIds, setGenreIds] = useState<string[]>([]);

  const handleSave = () => {
    onSave({
      title,
      description,
      published_date: publishedDate
        ? new Date(publishedDate).toISOString()
        : undefined,
      pages: pages ? Number(pages) : undefined,
      price: price ? Number(price) : undefined,
      cover_image_url: coverImage,
      state: "free",
      author_ids: authorIds,
      genre_ids: genreIds,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Create Book</DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <TextField
            label="Description"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            label="Published Date"
            type="date"
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Pages"
            type="number"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
          />

          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <TextField
            label="Cover Image URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
          />

          {/* Authors Multi-Select */}
          <FormControl>
            <InputLabel>Authors</InputLabel>
            <Select
              multiple
              value={authorIds}
              onChange={(e) =>
                setAuthorIds(e.target.value as string[])
              }
              renderValue={(selected) =>
                authors
                  .filter((a) => selected.includes(a.author_id))
                  .map((a) => a.name)
                  .join(", ")
              }
            >
              {authors.map((a) => (
                <MenuItem key={a.author_id} value={a.author_id}>
                  {a.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Genres Multi-Select */}
          <FormControl>
            <InputLabel>Genres</InputLabel>
            <Select
              multiple
              value={genreIds}
              onChange={(e) =>
                setGenreIds(e.target.value as string[])
              }
              renderValue={(selected) =>
                genres
                  .filter((g) => selected.includes(g.genre_id))
                  .map((g) => g.name)
                  .join(", ")
              }
            >
              {genres.map((g) => (
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBookModal;