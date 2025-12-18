export type AiInsights = {
  summary: string[];
  actionable: string[];
};

export type AiResponse = {
  success: boolean;
  question?: string;
  answer?: string;
  data?: Record<string, any>[];
  insights?: AiInsights;
  count?: number;
};

export type AssistantResponse = {
  success: boolean;
  question?: string;
  answer?: string;
  data?: any[];
  count?: number;
  method?: string;
  tableHeaders?: string[];
  error?: string;
  suggestions?: string[];
};
