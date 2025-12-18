type Props = {
  value: string;
  onChange: (value: string) => void;
  onAsk: () => void;
  loading?: boolean;
};

export const AssistantInput = ({
  value,
  onChange,
  onAsk,
  loading = false,
}: Props) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !loading) {
      onAsk();
    }
  };

  return (
    <div className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question... (e.g., Who owns the most books?)"
          disabled={loading}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={onAsk}
          disabled={loading || !value.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 disabled:bg-gray-400 
                     disabled:cursor-not-allowed font-medium transition-colors"
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </div>
    </div>
  );
};
