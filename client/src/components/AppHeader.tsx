// src/components/AppHeader.tsx
import React from "react";
import { AppBar, Toolbar, Typography, Box, Button, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  activeLink?: string;
  setActiveLink?: (link: string) => void;
  username?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({ activeLink, setActiveLink, username }) => {
  const navigate = useNavigate();

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

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontWeight: 500,
              color: "#000",
            }}
          >
            {username || "User"}
          </Typography>
          <Avatar
            alt="Profile"
            src="https://via.placeholder.com/40"
            sx={{
              width: 36,
              height: 36,
              cursor: "pointer",
              border: "2px solid #fff",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.1)" },
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
