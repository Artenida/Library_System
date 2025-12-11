import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  TextField,
} from "@mui/material";
import type { IBook } from "../types/bookTypes";

interface Props {
  open: boolean;
  book: IBook | null;
  onClose: () => void;
  onSave: (updatedBook: IBook) => void;
}

const EditOrderModal: React.FC<Props> = ({ open, book, onClose, onSave }) => {
  type ReadingStatus = "" | "reading" | "completed" | "returned" | "deleted";
  const [status, setStatus] = useState<
    "" | "reading" | "completed" | "returned" | "deleted"
  >("");

  useEffect(() => {
    setStatus(book?.user_books?.[0]?.status || "");
  }, [book]);

  const handleSave = () => {
    if (!book) return;

    const updatedBook: IBook = {
      ...book,
      user_books: [
        {
          user_book_id: book.user_books?.[0]?.user_book_id || "",
          status: status,
          created_at: book.user_books?.[0]?.created_at || "",
          from_date: book.user_books?.[0]?.from_date || "",
          to_date: book.user_books?.[0]?.to_date || "",
        },
      ],
    };

    console.log("Updated Book:", updatedBook); 
    onSave(updatedBook);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Edit Reading Status</DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <TextField
          select
          fullWidth
          label="Reading Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ReadingStatus)}
        >
          {["reading", "completed", "returned", "deleted"].map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </TextField>
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
export default EditOrderModal;
