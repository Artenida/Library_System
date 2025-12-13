import { useState } from "react";
import type { IBook } from "../../types/bookTypes";
import {
  Box,
  Container,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AdminBookTable from "../../components/admin/AdminBookTable";

const Dashboard = () => {
  const [search, setSearch] = useState("");

  const books: IBook[] = [];

  const filteredBooks = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Container
        sx={{
          mt: 2,
          mb: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search genres..."
            sx={{
              bgcolor: "#fff",
              "& .MuiOutlinedInput-root": {
                height: 40,
                borderRadius: "6px",
                fontSize: "0.9rem",
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Container>
      <AdminBookTable
        books={filteredBooks}
        onEdit={(b) => console.log("Edit", b)}
        onDelete={(b) => console.log("Delete", b)}
      />
    </>
  );
};

export default Dashboard;
