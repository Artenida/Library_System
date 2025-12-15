import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CircularProgress, Container, Box } from "@mui/material";
import { getAuthorsThunk } from "../../store/thunks/authorThunks";
import AuthorsTable from "../../components/admin/AuthorsTable";
import { useNavigate } from "react-router-dom";

interface IAuthor {
  author_id: string;
  name: string;
  birth_year: number;
}

const Authors = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { authors, loading } = useAppSelector((state) => state.author);

  useEffect(() => {
    dispatch(getAuthorsThunk());
  }, [dispatch]);

  const handleRowClick = (author: IAuthor) => {
    navigate(`/dashboard/authors/${author.author_id}`);
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Container sx={{ mt: 3 }}>
      <AuthorsTable authors={authors} onRowClick={handleRowClick} />
    </Container>
  );
};

export default Authors;
