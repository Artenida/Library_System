import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppHeader from "../components/layout/AppHeader";

const UserLayout = () => {
  return (
    <>
      <AppHeader />
      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default UserLayout;
