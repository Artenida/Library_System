// client/src/components/AIAssistant.tsx
import React, { useState } from "react";
import axios from "axios";

interface AssistantResponse {
  success: boolean;
  question: string;
  answer: string;
  data: any[];
  count: number;
  method: string;
  tableHeaders?: string[];
  error?: string;
  suggestions?: string[];
}

export const AIAssistant: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<AssistantResponse | null>(null);

  const exampleQueries = [
    "Who owns the most books?",
    "Which is the most popular book?",
    "Show the 5 most expensive books",
    "How many books are there?",
    "List all genres",
    "Show all authors",
    "What are the cheapest books?",
    "Who has the least books?",
  ];

  const handleAsk = async (queryText?: string) => {
    const questionToAsk = queryText || question;
    
    if (!questionToAsk.trim()) {
      alert("Please enter a question");
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const result = await axios.post<AssistantResponse>(
        "http://localhost:5000/api/assistant/ask",
        { question: questionToAsk },
        { withCredentials: true }
      );

      setResponse(result.data);
      if (!queryText) setQuestion(""); // Only clear if not from example
    } catch (error: any) {
      const errorResponse = error.response?.data || {
        success: false,
        error: "Failed to get response from AI assistant",
      };
      setResponse(errorResponse);
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
    handleAsk(example);
  };

  const renderTable = (data: any[], headers?: string[]) => {
    if (!data || data.length === 0) return null;

    const keys = headers || Object.keys(data[0]);

    return (
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              {keys.map((key, idx) => (
                <th
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-b"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-gray-50">
                {keys.map((key, colIdx) => {
                  const cellKey = headers ? Object.keys(row)[colIdx] : key;
                  return (
                    <td
                      key={colIdx}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-b"
                    >
                      {row[cellKey] !== null && row[cellKey] !== undefined
                        ? String(row[cellKey])
                        : "-"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📚 AI Library Assistant
        </h1>
        <p className="text-gray-600 mb-6">
          Ask questions about your library in natural language
        </p>

        {/* Input Section */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAsk()}
              placeholder="Ask a question... (e.g., Who owns the most books?)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={() => handleAsk()}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {loading ? "Thinking..." : "Ask"}
            </button>
          </div>
        </div>

        {/* Example Queries */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, idx) => (
              <button
                key={idx}
                onClick={() => handleExampleClick(example)}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                disabled={loading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Processing your question...</p>
          </div>
        )}

        {/* Response Section */}
        {response && !loading && (
          <div className="mt-6">
            {response.success ? (
              <>
                {/* Answer Summary */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-2">✓</span>
                    <div className="flex-1">
                      <p className="font-medium text-green-800 mb-1">
                        {response.answer}
                      </p>
                      <p className="text-xs text-green-600">
                        Method: {response.method} • Results: {response.count}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Data Table */}
                {response.data && response.data.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Results:
                    </h3>
                    {renderTable(response.data, response.tableHeaders)}
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Error Message */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-2">✗</span>
                    <div className="flex-1">
                      <p className="font-medium text-red-800">
                        {response.error}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Suggestions */}
                {response.suggestions && response.suggestions.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Try these instead:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {response.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleExampleClick(suggestion)}
                          className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• First tries rule-based parsing (instant, free)</li>
          <li>• Falls back to AI if needed (Hugging Face API)</li>
          <li>• Supports complex natural language questions</li>
          <li>• Results displayed as formatted tables</li>
        </ul>
      </div>
    </div>
  );
};