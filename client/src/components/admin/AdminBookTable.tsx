import { Box, Chip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { IBook } from "../../types/bookTypes";
import BookList from "../books/BookList";

interface Props {
  books: IBook[];
  onEdit: (book: IBook) => void;
  onDelete: (book: IBook) => void;
}

const AdminBookTable: React.FC<Props> = ({ books, onEdit, onDelete }) => {
  const columns = [
    { key: "title", label: "Title" },
    {
      key: "authors",
      label: "Authors",
      render: (b: IBook) => b.authors?.map((a) => a.name).join(", "),
    },
    {
      key: "genres",
      label: "Genres",
      render: (b: IBook) => (
        <Box display="flex" gap={0.5} flexWrap="wrap">
          {b.genres?.map((g) => (
            <Chip key={g.genre_id} label={g.name} size="small" />
          ))}
        </Box>
      ),
    },
    {
      key: "state",
      label: "Status",
      render: (b: IBook) => (
        <Chip
          label={b.state}
          color={b.state === "free" ? "success" : "warning"}
          size="small"
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (b: IBook) => (
        <Box>
          <IconButton onClick={() => onEdit(b)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(b)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return <BookList books={books} columns={columns} />;
};

export default AdminBookTable;
