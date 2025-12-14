import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CircularProgress, Container, Box } from "@mui/material";
import { getUsersThunk } from "../../store/thunks/userThunks";
import UsersTable from "../../components/admin/UsersTable";
import { useNavigate } from "react-router-dom";

interface IUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

const Users = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { users, loading } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(getUsersThunk());
  }, [dispatch]);

  const handleRowClick = (user: IUser) => {
    navigate(`/dashboard/users/${user.id}`);
  };

  if (loading) return <CircularProgress />;

  return (
    <>
      <Container sx={{ mt: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={5}>
            <CircularProgress />
          </Box>
        ) : (
          <UsersTable users={users} onRowClick={handleRowClick} />
        )}
      </Container>
    </>
  );
};

export default Users;
