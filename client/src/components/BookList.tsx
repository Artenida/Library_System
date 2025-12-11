import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import type { IBook } from "../types/bookTypes";

interface Column {
  key: string;
  label: string;
  render?: (book: IBook) => React.ReactNode;
}

interface BookListProps {
  books: IBook[];
  columns: Column[];
  onRowClick?: (book: IBook) => void;
}

const BookList: React.FC<BookListProps> = ({ books, columns, onRowClick }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key}>
                <strong>{col.label}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {books.map((book) => (
            <TableRow
              key={book.book_id}
              hover
              sx={{ cursor: onRowClick ? "pointer" : "default" }}
              onClick={() => onRowClick?.(book)}
            >
              {columns.map((col) => (
                <TableCell key={col.key}>
                  {col.render ? col.render(book) : (book as any)[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookList;
