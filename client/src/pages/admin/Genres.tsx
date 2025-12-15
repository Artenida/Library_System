import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CircularProgress, Container, Box } from "@mui/material";
import {
  deleteGenreThunk,
  getGenresThunk,
  updateGenreThunk,
} from "../../store/thunks/genreThunks";
import GenresTable from "../../components/admin/GenresTable";
import { useNavigate } from "react-router-dom";
import EditGenreModal from "../../components/modals/EditGenreModal";

interface IGenre {
  genre_id: string;
  name: string;
}

const Genres = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { genres, loading } = useAppSelector((state) => state.genre);

  const [editingGenre, setEditingGenre] = useState<IGenre | null>(null);

  useEffect(() => {
    dispatch(getGenresThunk());
  }, [dispatch]);

  const handleRowClick = (genre: IGenre) => {
    navigate(`/dashboard/genres/${genre.genre_id}`);
  };
  const handleEdit = (genre: IGenre) => {
    setEditingGenre(genre);
  };

  const handleDelete = (genre: IGenre) => {
    if (window.confirm(`Delete genre "${genre.name}"?`)) {
      dispatch(deleteGenreThunk(genre.genre_id));
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

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container sx={{ mt: 3 }}>
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
    </Container>
  );
};

export default Genres;
