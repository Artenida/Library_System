import React from "react";
import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EntityList from "../layout/EntityList";

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
      render: (user: IUser) => (
        <Box>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(user);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(user);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <EntityList
      items={users}
      rowKey="id"
      columns={columns}
      onRowClick={onRowClick}
    />
  );
};

export default UsersTable;
