type Props = {
  data: any[];
  headers?: string[];
};

export const AssistantTable = ({ data, headers }: Props) => {
  if (!data || data.length === 0) return null;

  const firstRow = data[0];

  // Build columns: map headers to object keys, or fallback to all keys
  const columns = headers
    ? headers.map((header) => {
        const key =
          Object.keys(firstRow).find(
            (k) => k.toLowerCase().replace(/_/g, " ") === header.toLowerCase()
          ) || Object.keys(firstRow)[0]; // fallback if not found
        return { header, key };
      })
    : Object.keys(firstRow)
        .filter((k) => k !== "id") // skip id if you want
        .map((key) => ({ header: key, key }));

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase border-b"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr key={rowIdx} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-6 py-4 text-sm text-gray-900 border-b"
                >
                  {row[col.key] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
