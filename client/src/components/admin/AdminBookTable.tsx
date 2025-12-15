import { Box, Chip, IconButton, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { IBook } from "../../types/bookTypes";
import EntityList from "../layout/EntityList";

interface Props {
  books: IBook[];
  onRowClick: (book: IBook) => void;
}

const AdminBookTable: React.FC<Props> = ({ books, onRowClick }) => {
  const columns = [
    {
      key: "cover",
      label: "Cover",
      render: (book: IBook) =>
        book.cover_image_url ? (
          <img
            src={book.cover_image_url}
            alt={book.title}
            style={{
              width: 60,
              height: 80,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No Image
          </Typography>
        ),
    },
    { key: "title", label: "Title" },
    {
      key: "published_date",
      label: "Published",
      render: (b: IBook) => new Date(b.published_date).toLocaleDateString(),
    },
    { key: "pages", label: "Pages" },
    { key: "price", label: "Price", render: (b: IBook) => `$${b.price}` },
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
      label: "State",
      render: (b: IBook) => (
        <Chip
          label={b.state === "free" ? "Free" : "Waiting"}
          color={b.state === "free" ? "success" : "warning"}
          size="small"
        />
      ),
    },
    {
      key: "reading_status",
      label: "Reading Status",
      render: (b: IBook) => {
        if (!b.user_books || b.user_books.length === 0) {
          return (
            <Chip label="—" size="small" variant="outlined" color="default" />
          );
        }

        return (
          <Box display="flex" gap={0.5} flexWrap="wrap">
            {b.user_books.map((ub) => (
              <Chip key={ub.user_book_id} label={ub.status} size="small" />
            ))}
          </Box>
        );
      },
    },

    {
      key: "user_name",
      label: "Active User Name",
      render: (b: IBook) => {
        if (!b.user || b.user.length === 0) {
          return (
            <Chip label="—" size="small" variant="outlined" color="default" />
          );
        }

        return (
          <Box display="flex" gap={0.5} flexWrap="wrap">
            {b.user.map((u) => (
              <Chip key={u.user_id} label={u.name} size="small" />
            ))}
          </Box>
        );
      },
    },

    {
      key: "actions",
      label: "Actions",
      render: () => (
        <Box>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <EntityList
      items={books}
      rowKey="book_id"
      columns={columns}
      onRowClick={onRowClick}
    />
  );
};

export default AdminBookTable;
