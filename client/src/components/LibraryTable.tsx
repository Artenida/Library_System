import React from "react";
import { Button, Chip, Box, Typography } from "@mui/material";
import BookList from "./BookList";
import type { IBook } from "../types/bookTypes";

interface Props {
  books: IBook[];
  onTake?: (book: IBook) => void;
  onRowClick?: (book: IBook) => void;
}

const LibraryTable: React.FC<Props> = ({ books, onTake, onRowClick }) => {
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
        <Box display="flex" flexWrap="wrap" gap={0.5}>
          {b.genres?.map((g) => (
            <Chip key={g.genre_id} label={g.name} size="small" />
          ))}
        </Box>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (b: IBook) => (
        <Chip
          label={b.state === "free" ? "Free" : "Waiting"}
          color={b.state === "free" ? "success" : "warning"}
          size="small"
        />
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (b: IBook) => (
        <Button
          variant="contained"
          disabled={b.state !== "free"}
          onClick={(e) => {
            e.stopPropagation();
            onTake?.(b);
          }}
        >
          Take Book
        </Button>
      ),
    },
  ];

  return <BookList books={books} columns={columns} onRowClick={onRowClick} />;
};

export default LibraryTable;
