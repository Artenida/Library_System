import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CircularProgress, Container, Box } from "@mui/material";
import {
  deleteAuthorThunk,
  getAuthorsThunk,
  updateAuthorThunk,
} from "../../store/thunks/authorThunks";
import AuthorsTable from "../../components/admin/AuthorsTable";
import { useNavigate } from "react-router-dom";
import EditAuthorModal from "../../components/modals/EditAuthorModal";

interface IAuthor {
  author_id: string;
  name: string;
  birth_year: number;
}

const Authors = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authors, loading } = useAppSelector((state) => state.author);

  const [editingAuthor, setEditingAuthor] = useState<IAuthor | null>(null);

  useEffect(() => {
    dispatch(getAuthorsThunk());
  }, [dispatch]);

  const handleRowClick = (author: IAuthor) => {
    navigate(`/dashboard/authors/${author.author_id}`);
  };

  const handleDelete = (author: IAuthor) => {
    if (window.confirm(`Delete author "${author.name}"?`)) {
      dispatch(deleteAuthorThunk(author.author_id));
    }
  };

  const handleEdit = (author: IAuthor) => {
    setEditingAuthor(author);
  };

  const handleSaveEdit = (updatedAuthor: IAuthor) => {
    dispatch(
      updateAuthorThunk({
        id: updatedAuthor.author_id,
        data: {
          name: updatedAuthor.name,
          birth_year: updatedAuthor.birth_year,
        },
      })
    );

    setEditingAuthor(null);
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container sx={{ mt: 3 }}>
      <AuthorsTable
        authors={authors}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EditAuthorModal
        open={Boolean(editingAuthor)}
        author={editingAuthor}
        onClose={() => setEditingAuthor(null)}
        onSave={handleSaveEdit}
      />
    </Container>
  );
};

export default Authors;
