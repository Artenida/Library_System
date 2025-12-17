import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface IGenre {
  genre_id: string;
  name: string;
}

interface Props {
  open: boolean;
  genre: IGenre | null;
  onClose: () => void;
  onSave: (genre: IGenre) => void;
}

const EditGenreModal: React.FC<Props> = ({
  open,
  genre,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (genre) {
      setName(genre.name);
    }
  }, [genre]);

  const handleSave = () => {
    if (!genre) return;

    onSave({
      ...genre,
      name,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Genre</DialogTitle>

      <DialogContent>
        <TextField
          label="Genre name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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

export default EditGenreModal;
