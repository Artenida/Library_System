import React from "react";
import type { IBook } from "../../types/bookTypes";
import EntityList from "../layout/EntityList";

interface BooksTableProps {
  books: IBook[];
  onRowClick?: (book: IBook) => void;
  onEdit?: (book: IBook) => void;
  onDelete?: (book: IBook) => void;
}

const BooksTable: React.FC<BooksTableProps> = ({
  books,
  onRowClick,
}) => {
  const columns = [
    { key: "title", label: "Title" },
    { key: "description", label: "Description" },
    {
      key: "published_date",
      label: "Published Date",
      render: (book: IBook) => {
        const date = new Date(book.published_date);
        return date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
    },
    { key: "pages", label: "Pages" },
    { key: "price", label: "Price" },
    { key: "state", label: "State" },
  ];

  return (
    <EntityList
      items={books}
      rowKey="book_id"
      columns={columns}
      onRowClick={onRowClick}
    />
  );
};

export default BooksTable;
