import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

interface IAuthor {
  author_id: string;
  name: string;
  birth_year: number;
}

interface Props {
  open: boolean;
  author: IAuthor | null;
  onClose: () => void;
  onSave: (author: IAuthor) => void;
}

const EditAuthorModal: React.FC<Props> = ({
  open,
  author,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState<number | "">("");

  useEffect(() => {
    if (author) {
      setName(author.name);
      setBirthYear(author.birth_year);
    }
  }, [author]);

  const handleSave = () => {
    if (!author) return;

    onSave({
      ...author,
      name,
      birth_year: Number(birthYear),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Author</DialogTitle>

      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Birth Year"
          type="number"
          fullWidth
          margin="normal"
          value={birthYear}
          onChange={(e) => setBirthYear(Number(e.target.value))}
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

export default EditAuthorModal;
