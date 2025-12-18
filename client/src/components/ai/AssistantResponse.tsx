import type { AssistantResponse as ResponseType } from "../../types/aiTypes";
import { AssistantTable } from "./AssistantTable";

export const AssistantResponse = ({ response }: { response: ResponseType }) => {
  if (!response.data || response.data.length === 0) return null;
  
  return (
    <div className="overflow-x-auto mt-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
        <p className="font-medium text-green-800">{response.answer}</p>
        <p className="text-xs text-green-600">
          Method: {response.method} • Results: {response.count}
        </p>
      </div>
      <AssistantTable data={response.data} headers={response.tableHeaders} />
    </div>
  );
};
