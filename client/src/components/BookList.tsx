import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import type { IBook } from "../types/bookTypes";
import { useNavigate } from "react-router-dom";

interface BookListProps {
  books: IBook[];
  userRole: string;
}

const BookList: React.FC<BookListProps> = ({ books, userRole }) => {
  const navigate = useNavigate();
  
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Cover</strong>
            </TableCell>
            <TableCell>
              <strong>Title</strong>
            </TableCell>
            {/* <TableCell><strong>Description</strong></TableCell>  */}

            {userRole === "user" && (
              <>
                <TableCell>
                  <strong>Published</strong>
                </TableCell>
                <TableCell>
                  <strong>Pages</strong>
                </TableCell>
                <TableCell>
                  <strong>Price</strong>
                </TableCell>
                <TableCell>
                  <strong>Authors</strong>
                </TableCell>
                <TableCell>
                  <strong>Genres</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
              </>
            )}

            <TableCell>
              <strong>Action</strong>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {books?.map((book) => {
            const isFree = book.state === "free";

            return (
              <TableRow 
                key={book.book_id}
                hover
                sx={{cursor: "pointer"}}
                onClick={() => navigate(`/books/${book.book_id}`)}>
                <TableCell>
                  {book.cover_image_url ? (
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
                  )}
                </TableCell>

                <TableCell>{book.title}</TableCell>

                {/* <TableCell sx={{ maxWidth: 250 }}>
                  <Typography noWrap>{book.description}</Typography>
                </TableCell> */}

                {userRole === "user" && (
                  <>
                    <TableCell>
                      {new Date(book.published_date).toLocaleDateString()}
                    </TableCell>

                    <TableCell>{book.pages}</TableCell>

                    <TableCell>${book.price}</TableCell>

                    <TableCell>
                      {book.authors?.map((a) => a.name).join(", ")}
                    </TableCell>

                    <TableCell>
                      <Box display="flex" flexWrap="wrap" gap={0.5}>
                        {book.genres?.map((g) => (
                          <Chip key={g.genre_id} label={g.name} size="small" />
                        ))}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={isFree ? "Free" : "Waiting"}
                        color={isFree ? "success" : "warning"}
                        size="small"
                      />
                    </TableCell>
                  </>
                )}

                <TableCell>
                  <Button variant="contained" disabled={!isFree} fullWidth>
                    Take Book
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookList;
