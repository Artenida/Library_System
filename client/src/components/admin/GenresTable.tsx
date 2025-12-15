import React from "react";
import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EntityList from "../layout/EntityList";

interface IGenre {
  genre_id: string;
  name: string;
}

interface Props {
  genres: IGenre[];
  onEdit?: (genre: IGenre) => void;
  onDelete?: (genre: IGenre) => void;
  onRowClick?: (genre: IGenre) => void;
}

const GenresTable: React.FC<Props> = ({
  genres,
  onEdit,
  onDelete,
  onRowClick,
}) => {
  const columns = [
    { key: "name", label: "Name" },
    {
      key: "action",
      label: "Action",
      render: (genre: IGenre) => (
        <Box>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(genre);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(genre);
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
      items={genres}
      rowKey="genre_id"
      columns={columns}
      onRowClick={onRowClick}
    />
  );
};

export default GenresTable;
