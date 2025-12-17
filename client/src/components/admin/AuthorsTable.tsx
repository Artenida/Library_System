import React from "react";
import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EntityList from "../layout/EntityList";

interface IAuthor {
  author_id: string;
  name: string;
  birth_year: number;
}

interface Props {
  authors: IAuthor[];
  onEdit?: (author: IAuthor) => void;
  onDelete?: (author: IAuthor) => void;
  onRowClick?: (author: IAuthor) => void;
}

const AuthorsTable: React.FC<Props> = ({
  authors,
  onEdit,
  onDelete,
  onRowClick,
}) => {
  const columns = [
    { key: "name", label: "Name" },
    { key: "birth_year", label: "Birth Year" },
    {
      key: "action",
      label: "Action",
      render: (author: IAuthor) => (
        <Box>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(author);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(author);
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
      items={authors}
      rowKey="author_id"
      columns={columns}
      onRowClick={onRowClick}
    />
  );
};

export default AuthorsTable;
