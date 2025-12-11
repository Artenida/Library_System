import { Box, Typography, Avatar, TextField, Button, Stack } from "@mui/material";
import { useAppSelector } from "../../store/hooks";

const Profile = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
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
          value={user?.username || ""}
          InputProps={{ readOnly: true }}
          fullWidth
        />
        <TextField
          label="Email"
          value={user?.email || ""}
          InputProps={{ readOnly: true }}
          fullWidth
        />
        <TextField
          label="Password"
          value="********"
          type="password"
          InputProps={{ readOnly: true }}
          fullWidth
        />
        <TextField
          label="Role"
          value={user?.role || "user"}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Stack>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button variant="contained" color="primary">
          Edit Profile
        </Button>
        <Button variant="outlined" color="error">
          Delete Profile
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
