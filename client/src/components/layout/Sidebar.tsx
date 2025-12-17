import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import BookIcon from "@mui/icons-material/Book";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import CategoryIcon from "@mui/icons-material/Category";
import SmartToyIcon from "@mui/icons-material/SmartToy"; // <-- AI Assistant icon
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />

      <List>
        <ListItemButton onClick={() => navigate("/dashboard")}>
          <ListItemIcon>
            <BookIcon />
          </ListItemIcon>
          <ListItemText primary="Books" />
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/dashboard/users")}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/dashboard/authors")}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Authors" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/dashboard/genres")}>
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary="Genres" />
        </ListItemButton>
        <ListItemButton onClick={() => navigate("/dashboard/assistant")}>
          <ListItemIcon>
            <SmartToyIcon />
          </ListItemIcon>
          <ListItemText primary="AI Assistant" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default AdminSidebar;
