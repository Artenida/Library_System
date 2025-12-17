import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (genre: { name: string }) => void;
}

const CreateGenreModal: React.FC<Props> = ({ open, onClose, onSave }) => {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (!name) return;
    onSave({ name });
    setName("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Genre</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGenreModal;
