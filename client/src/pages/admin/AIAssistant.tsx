// client/src/components/AIAssistant.tsx
import React, { useState } from "react";
import axios from "axios";
import { AssistantInput } from "../../components/ai/AssistantInput";
import { AssistantExamples } from "../../components/ai/AssistantExamples";
import { useAppSelector } from "../../store/hooks";
import { AssistantResponse } from "../../components/ai/AssistantResponse";

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
  const token = useAppSelector((state) => state.auth.token);

  const exampleQueries = [
    "Who owns the most books?",
    "Which is the most popular book?",
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
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponse(result.data);
      if (!queryText) setQuestion("");
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

  return (
    <>
      <AssistantInput
        value={question}
        onChange={setQuestion}
        onAsk={() => handleAsk(question)}
        loading={loading}
      />

      <AssistantExamples
        examples={exampleQueries}
        onSelect={(q) => {
          setQuestion(q);
          handleAsk(q);
        }}
      />

      {response &&
        response.success &&
        response.data &&
        response.data.length > 0 && <AssistantResponse response={response} />}

      {response && !response.success && (
        <div className="mt-4 text-red-500">
          {response.error || "Something went wrong"}
        </div>
      )}
    </>
  );
};
