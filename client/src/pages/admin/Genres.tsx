import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CircularProgress, Container, Box, Button } from "@mui/material";
import {
  createGenreThunk,
  deleteGenreThunk,
  getGenresThunk,
  updateGenreThunk,
} from "../../store/thunks/genreThunks";
import GenresTable from "../../components/admin/GenresTable";
import { useNavigate } from "react-router-dom";
import EditGenreModal from "../../components/modals/EditGenreModal";
import CreateGenreModal from "../../components/modals/CreateGenreModal";

interface IGenre {
  genre_id: string;
  name: string;
}

const Genres = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { genres, loading } = useAppSelector((state) => state.genre);

  const [editingGenre, setEditingGenre] = useState<IGenre | null>(null);
  const [creatingGenre, setCreatingGenre] = useState(false);

  useEffect(() => {
    dispatch(getGenresThunk());
  }, [dispatch]);

  const handleRowClick = (genre: IGenre) => {
    navigate(`/dashboard/genres/${genre.genre_id}`);
  };
  const handleEdit = (genre: IGenre) => {
    setEditingGenre(genre);
  };

  const handleDelete = async (genre: IGenre) => {
    if (!window.confirm(`Delete genre "${genre.name}"?`)) return;

    try {
      const message = await dispatch(deleteGenreThunk(genre.genre_id)).unwrap();
      alert(message);
    } catch (error: any) {
      alert(error);
    }
  };

  const handleSaveEdit = (updatedGenre: IGenre) => {
    dispatch(
      updateGenreThunk({
        id: updatedGenre.genre_id,
        data: {
          name: updatedGenre.name,
        },
      })
    );

    setEditingGenre(null);
  };

  const handleSaveCreate = async (newAuthor: Omit<IGenre, "genre_id">) => {
    await dispatch(createGenreThunk(newAuthor)).unwrap();
    dispatch(getGenresThunk());
    setCreatingGenre(false);
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container sx={{ mt: 3 }}>
      <Button
        variant="contained"
        onClick={() => setCreatingGenre(true)}
        sx={{ mb: 2 }}
      >
        Create Genre
      </Button>
      <GenresTable
        genres={genres}
        onRowClick={handleRowClick}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EditGenreModal
        open={Boolean(editingGenre)}
        genre={editingGenre}
        onClose={() => setEditingGenre(null)}
        onSave={handleSaveEdit}
      />
      <CreateGenreModal
        open={creatingGenre}
        onClose={() => setCreatingGenre(false)}
        onSave={handleSaveCreate}
      />
    </Container>
  );
};

export default Genres;
