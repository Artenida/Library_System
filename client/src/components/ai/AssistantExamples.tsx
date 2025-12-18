type Props = {
  examples: string[];
  onSelect: (q: string) => void;
  disabled?: boolean;
};

export const AssistantExamples = ({ examples, onSelect, disabled }: Props) => (
  <div className="mb-6">
    <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
    <div className="flex flex-wrap gap-2">
      {examples.map((ex) => (
        <button
          key={ex}
          onClick={() => onSelect(ex)}
          disabled={disabled}
          className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
        >
          {ex}
        </button>
      ))}
    </div>
  </div>
);
