import React from "react";
import { Box, IconButton } from "@mui/material";
import UsersList from "./UsersList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface IUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface Props {
  users: IUser[];
  onEdit?: (user: IUser) => void;
  onDelete?: (user: IUser) => void;
  onRowClick?: (user: IUser) => void;
}

const UsersTable: React.FC<Props> = ({
  users,
  onEdit,
  onDelete,
  onRowClick,
}) => {
  const columns = [
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    {
      key: "action",
      label: "Action",
      render: () => (
        <Box>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return <UsersList users={users} columns={columns} onRowClick={onRowClick} />;
};

export default UsersTable;
