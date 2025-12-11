// src/components/AppHeader.tsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout } from "../store/slices/authSlice";

interface AppHeaderProps {
  activeLink?: string;
  setActiveLink?: (link: string) => void;
  username?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  activeLink,
  setActiveLink,
  username,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#fff" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            fontFamily: "'Roboto Slab', serif",
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          Books
        </Typography>

        <Box sx={{ display: "flex", gap: 3 }}>
          {["Library", "Orders"].map((text) => (
            <Button
              key={text}
              onClick={() =>
                text === "Library" ? navigate("/") : navigate("/orders")
              }
              sx={{
                color: activeLink === text ? "#1976d2" : "#000",
                textTransform: "none",
                fontFamily: "'Roboto', sans-serif",
                fontWeight: 500,
                borderRadius: "8px",
                bgcolor: "inherit",
              }}
            >
              {text}
            </Button>
          ))}
        </Box>

        <Box sx={{ p: 3 }}>
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
              onClick={() => navigate("/profile")}
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
                onClick={() => navigate("/profile")}
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

export default AppHeader;
