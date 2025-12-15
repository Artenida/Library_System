import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CircularProgress, Container, Box } from "@mui/material";
import { getGenresThunk } from "../../store/thunks/genreThunks";
import GenresTable from "../../components/admin/GenresTable";
import { useNavigate } from "react-router-dom";

interface IGenre {
  genre_id: string;
  name: string;
}

const Genres = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { genres, loading } = useAppSelector((state) => state.genre);

  useEffect(() => {
    dispatch(getGenresThunk());
  }, [dispatch]);

  const handleRowClick = (genre: IGenre) => {
    navigate(`/dashboard/genres/${genre.genre_id}`);
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container sx={{ mt: 3 }}>
      <GenresTable genres={genres} onRowClick={handleRowClick} />
    </Container>
  );
};

export default Genres;
