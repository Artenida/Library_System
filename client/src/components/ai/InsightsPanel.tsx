// client/src/components/InsightsPanel.tsx
import React from "react";

interface Book {
  title: string;
  pages: number;
  genres: string;
}

interface Insights {
  summary: string[];
  actionable: string[];
}

interface InsightsResponse {
  success: boolean;
  insights: Insights;
  data: Book[];
}

type Props = {
  insightsData: InsightsResponse;
};

export const InsightsPanel: React.FC<Props> = ({ insightsData }) => {
  if (!insightsData?.success) return null;

  const { insights, data } = insightsData;

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg space-y-6">
      {/* Summary Section */}
      <section>
        <h2 className="text-xl font-bold mb-2">Summary</h2>
        <ul className="list-disc list-inside space-y-1">
          {insights.summary.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Actionable Section */}
      <section>
        <h2 className="text-xl font-bold mb-2">Actionable Tips</h2>
        <ul className="list-decimal list-inside space-y-1">
          {insights.actionable.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </section>

      {/* Book List Section */}
      <section>
        <h2 className="text-xl font-bold mb-2">Books</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Pages</th>
                <th className="py-2 px-4 border-b">Genres</th>
              </tr>
            </thead>
            <tbody>
              {data.map((book, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{book.title}</td>
                  <td className="py-2 px-4 border-b">{book.pages}</td>
                  <td className="py-2 px-4 border-b">{book.genres}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
