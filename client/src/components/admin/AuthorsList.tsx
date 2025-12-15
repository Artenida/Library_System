import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface IAuthor {
  author_id: string;
  name: string;
  birth_year: number;
}

interface Column {
  key: string;
  label: string;
  render?: (author: IAuthor) => React.ReactNode;
}

interface Props {
  authors: IAuthor[];
  columns: Column[];
  onRowClick?: (author: IAuthor) => void;
}

const AuthorsList = ({ authors, columns, onRowClick }: Props) => {
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
          {Array.isArray(authors) &&
            authors.map((author) => (
              <TableRow
                key={author.author_id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => onRowClick?.(author)}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(author) : (author as any)[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AuthorsList;
