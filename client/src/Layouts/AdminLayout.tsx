import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/Sidebar";
import AdminNavbar from "../components/AdminNavbar";

const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <AdminSidebar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        <AdminNavbar />
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
