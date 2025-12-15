import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CircularProgress, Container, Box } from "@mui/material";
import {
  deleteUserThunk,
  getUsersThunk,
  updateUserThunk,
} from "../../store/thunks/userThunks";
import UsersTable from "../../components/admin/UsersTable";
import { useNavigate } from "react-router-dom";
import EditUserModal from "../../components/modals/EditUserModal";

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

  const [editingUser, setEditingUser] = useState<IUser | null>(null);

  useEffect(() => {
    dispatch(getUsersThunk());
  }, [dispatch]);

  const handleRowClick = (user: IUser) => {
    navigate(`/dashboard/users/${user.id}`);
  };

  const handleEdit = (user: IUser) => {
    setEditingUser(user);
  };

  const handleDelete = async (user: IUser) => {
    try {
      await dispatch(deleteUserThunk(user.id)).unwrap();
      dispatch(getUsersThunk());
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSaveEdit = async (updatedUser: IUser) => {
    try {
      await dispatch(
        updateUserThunk({
          id: updatedUser.id,
          data: {
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
          },
        })
      ).unwrap();

      dispatch(getUsersThunk());
      setEditingUser(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Container sx={{ mt: 3 }}>
        <UsersTable
          users={users}
          onRowClick={handleRowClick}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <EditUserModal
          open={Boolean(editingUser)}
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveEdit}
        />
      </Container>
    </>
  );
};

export default Users;
