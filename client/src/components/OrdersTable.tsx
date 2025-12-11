import React, { useState } from "react";
import { Button, Box, Typography, Chip } from "@mui/material";
import BookList from "./BookList";
import type { IBook } from "../types/bookTypes";
import EditOrderModal from "./EditOrderModal";

interface Props {
  books: IBook[];
  onEdit: (updatedBook: IBook) => void;
  onDelete: (book: IBook) => void;
  onRowClick?: (book: IBook) => void;
}

const OrdersTable: React.FC<Props> = ({
  books,
  onEdit,
  onDelete,
  onRowClick,
}) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);

  const columns = [
    {
      key: "cover",
      label: "Cover",
      render: (b: IBook) =>
        b.cover_image_url ? (
          <img
            src={b.cover_image_url}
            alt={b.title}
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
        <Box display="flex" flexWrap="wrap" gap={0.5}>
          {b.genres?.map((g) => (
            <Chip key={g.genre_id} label={g.name} size="small" />
          ))}
        </Box>
      ),
    },
    {
      key: "reading_status",
      label: "Status",
      render: (b: IBook) => {
        const ub = b.user_books?.[0];
        if (!ub || !ub.status) {
          return (
            <Typography variant="body2" color="text.secondary">
              No status
            </Typography>
          );
        }
        return (
          <Chip
            label={ub.status}
            size="small"
            color={
              ub.status === "completed"
                ? "success"
                : ub.status === "reading"
                ? "primary"
                : ub.status === "returned"
                ? "info"
                : ub.status === "deleted"
                ? "error"
                : "default"
            }
          />
        );
      },
    },
    {
      key: "action",
      label: "Action",
      render: (b: IBook) => (
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBook(b);
              setOpenEdit(true);
            }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(b);
            }}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <BookList books={books} columns={columns} onRowClick={onRowClick} />
      <EditOrderModal
        open={openEdit}
        book={selectedBook}
        onClose={() => setOpenEdit(false)}
        onSave={onEdit}
      />
    </>
  );
};

export default OrdersTable;
