type Props = {
  data: any[];
  headers?: string[];
};

export const AssistantTable = ({ data, headers }: Props) => {
  if (!data || data.length === 0) return null;

  const firstRow = data[0];

  const columns = headers
    ? headers
        .map((header) => {
          const key =
            Object.keys(firstRow).find(
              (k) => k.toLowerCase() === header.toLowerCase()
            ) || header;
          return { header, key };
        })
        .filter((col) => !col.key.toLowerCase().endsWith("id"))
    : Object.keys(firstRow)
        .filter((k) => !k.toLowerCase().endsWith("id")) 
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