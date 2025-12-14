import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

interface IUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface Column {
  key: string;
  label: string;
  render?: (user: IUser) => React.ReactNode;
}

interface Props {
  users: IUser[];
  columns: Column[];
  onRowClick?: (user: IUser) => void;
}

const UsersList = ({ users, columns, onRowClick }: Props) => {
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
          {Array.isArray(users) &&
            users?.map((user) => (
              <TableRow
                key={user.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => onRowClick?.(user)}
              >
                {columns.map((col) => (
                  <TableCell key={col.key}>
                    {col.render ? col.render(user) : (user as any)[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersList;
