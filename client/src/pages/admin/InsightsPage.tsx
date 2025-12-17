import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearInsights } from "../../store/slices/aiSlice";
import { InsightsPanel } from "../../components/ai/InsightsPanel";
import { fetchInsightsForUser } from "../../store/thunks/aiThunks";

const InsightsPage = () => {
  const dispatch = useAppDispatch();
  const { insightsData, loading, error } = useAppSelector((state) => state.ai);
  const [userName, setUserName] = useState("");

  const handleFetch = () => {
    if (!userName) return;
    dispatch(fetchInsightsForUser({ userName }));
  };

  const handleClear = () => {
    dispatch(clearInsights());
    setUserName("");
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Enter username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border border-gray-300 rounded p-2 flex-1"
        />
        <button
          onClick={handleFetch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Generate Insights
        </button>
        <button
          onClick={handleClear}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Clear
        </button>
      </div>

      {loading && <p>Loading insights...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {insightsData && <InsightsPanel insightsData={insightsData} />}
    </div>
  );
};

export default InsightsPage;
