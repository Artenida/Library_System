export function formatAssistantResponse(
  question: string,
  results: any[],
  method: string
) {
  return {
    question,
    answer:
      results.length === 0
        ? "No results found."
        : `Found ${results.length} result(s).`,
    data: results,
    count: results.length,
    method,
  };
}
