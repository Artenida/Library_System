import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface IGenre {
  genre_id: string;
  name: string;
}

interface Column {
  key: string;
  label: string;
  render?: (genre: IGenre) => React.ReactNode;
}

interface Props {
  genres: IGenre[];
  columns: Column[];
  onRowClick?: (genre: IGenre) => void;
}

const GenresList = ({ genres, columns, onRowClick }: Props) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key}>
                <strong>{col.label}</strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {Array.isArray(genres) &&
            genres.map((genre) => (
              <TableRow
                key={genre.genre_id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => onRowClick?.(genre)}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(genre) : (genre as any)[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GenresList;
