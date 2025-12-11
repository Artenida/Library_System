import {
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import AppHeader from "../../components/AppHeader";
import { useState } from "react";

const Profile = () => {
  const user = useAppSelector((state) => state.auth.user);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [role] = useState(user?.role || "user");

  const handleEditProfile = () => {
    const updatedUser = {
      username,
      email,
      role,
      ...(password && { password }),
    };

    console.log("Edit profile data to send to backend:", updatedUser);
  };

  const handleDeleteProfile = () => {
    console.log("Delete profile request for user_id:", user?.id);
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
