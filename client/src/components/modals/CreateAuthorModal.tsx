import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (author: { name: string; birth_year: number }) => void;
}

const CreateAuthorModal: React.FC<Props> = ({ open, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState<number | "">("");

  const handleSave = () => {
    if (!name || !birthYear) return;
    onSave({ name, birth_year: Number(birthYear) });
    setName("");
    setBirthYear("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Author</DialogTitle>
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAuthorModal;
