import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { CircularProgress, Container, Box, Button } from "@mui/material";
import {
  createUserThunk,
  deleteUserThunk,
  getUsersThunk,
  updateUserThunk,
} from "../../store/thunks/userThunks";
import UsersTable from "../../components/admin/UsersTable";
import { useNavigate } from "react-router-dom";
import EditUserModal from "../../components/modals/EditUserModal";
import CreateUserModal from "../../components/modals/CreateUserModal";

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
  const [creatingUser, setCreatingUser] = useState(false);

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
    if (!window.confirm(`Delete user "${user.username}"?`)) return;

    try {
      const message = await dispatch(deleteUserThunk(user.id)).unwrap();

      alert(message);
      dispatch(getUsersThunk());
    } catch (error: any) {
      alert(error); 
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

  const handleCreateUser = async (data: {
    username: string;
    email: string;
    password: string;
    role: string;
  }) => {
    try {
      await dispatch(createUserThunk(data)).unwrap();
      dispatch(getUsersThunk());
      setCreatingUser(false);
    } catch (err) {
      console.error("Create failed", err);
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
        <Box mb={2}>
          <Button variant="contained" onClick={() => setCreatingUser(true)}>
            Create User
          </Button>
        </Box>

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

        <CreateUserModal
          open={creatingUser}
          onClose={() => setCreatingUser(false)}
          onSave={handleCreateUser}
        />
      </Container>
    </>
  );
};

export default Users;
