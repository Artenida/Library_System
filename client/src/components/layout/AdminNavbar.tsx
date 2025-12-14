import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";
import LogoutIcon from "@mui/icons-material/Logout";

const AdminNavbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const SIDEBAR_WIDTH = 240;

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      color="default"
      sx={{
        width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
        ml: `${SIDEBAR_WIDTH}px`,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight={600}>
          Admin Dashboard
        </Typography>

        <Box sx={{ p: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              alt={user?.username}
              src="https://via.placeholder.com/80"
              sx={{
                width: 36,
                height: 36,
                cursor: "pointer",
                border: "2px solid #fff",
                transition: "transform 0.2s",
                "&:hover": { transform: "scale(1.1)" },
              }}
              onClick={() => navigate("/dashboard/profile")}
            />
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: 500,
                  color: "#000",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/dashboard/profile")}
              >
                {user?.username}
              </Typography>
            </Box>
            <IconButton onClick={handleSignOut} color="error" sx={{ ml: 2 }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
