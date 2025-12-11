import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import AppHeader from "../../components/AppHeader";
import { useState } from "react";
import { deleteUserThunk, updateUserThunk } from "../../store/thunks/userThunks";
import { logout } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const user = useAppSelector((state) => state.auth.user);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password_hash, setPasswordHash] = useState("");
  const [role] = useState(user?.role || "user");

  const handleEditProfile = () => {
    if (!user?.id) return;

    const updatedUser = {
      username,
      email,
      role,
      ...(password_hash && { password_hash }),
    };

    dispatch(updateUserThunk({ id: user.id, data: updatedUser }))
      .unwrap()
      .then(() => {
        console.log("User updated successfully!");
      })
      .catch((error) => {
        console.error("Update failed: ", error);
      });
  };

  const handleDeleteProfile = () => {
    if (!user?.id) return;

  dispatch(deleteUserThunk(user.id))
    .unwrap()
    .then(() => {
      dispatch(logout());
      navigate("/login");
    })
    .catch((err: any) => {
      console.error("Delete failed:", err);
    });
  };

  return (
    <Box>
      <AppHeader />

      <Box sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar
            alt={user?.username}
            src="https://via.placeholder.com/80"
            sx={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant="h5">{user?.username}</Typography>
            <Typography variant="body2" color="text.secondary">
              User Profile
            </Typography>
          </Box>
        </Box>

        <Stack spacing={2}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
          />

          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <TextField
            label="New Password"
            type="password"
            value={password_hash}
            onChange={(e) => setPasswordHash(e.target.value)}
            placeholder="Leave empty to keep current password"
            fullWidth
          />

          <TextField
            label="Role"
            value={role}
            fullWidth
            InputProps={{ readOnly: true }}
          />
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button variant="contained" onClick={handleEditProfile}>
            Save Changes
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteProfile}
          >
            Delete Profile
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
