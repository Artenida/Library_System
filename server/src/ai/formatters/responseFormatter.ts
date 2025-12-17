interface AssistantResponse {
  question: string;
  answer: string;
  data: any[];
  count: number;
  method: string;
  tableHeaders?: string[];
}

export function formatAssistantResponse(
  question: string,
  results: any[],
  method: string
): AssistantResponse {
  const response: AssistantResponse = {
    question,
    answer: "",
    data: results,
    count: results.length,
    method,
  };

  // Generate natural language answer based on results
  if (results.length === 0) {
    response.answer = "No results found for your question.";
    return response;
  }

  const firstRow = results[0];
  const questionLower = question.toLowerCase();

  // Format answer based on question type
  if (
    questionLower.includes("who owns the most") ||
    questionLower.includes("who has the most")
  ) {
    response.answer = `${firstRow.username} owns the most books with ${firstRow.book_count} book(s).`;
    response.tableHeaders = ["Username", "Email", "Book Count"];
  } else if (questionLower.includes("most popular book")) {
    response.answer = `The most popular book is "${firstRow.title}" by ${
      firstRow.authors || "Unknown"
    }.`;
    response.tableHeaders = [
      "Title",
      "Authors",
      "Genres",
      "Price",
      "Published Date",
    ];
  } else if (
    questionLower.includes("least") ||
    questionLower.includes("fewest")
  ) {
    response.answer = `${firstRow.username} has the fewest books with ${firstRow.book_count} book(s).`;
    response.tableHeaders = ["Username", "Email", "Book Count"];
  } else if (questionLower.includes("available")) {
    response.answer = `Found ${results.length} available book(s).`;
    response.tableHeaders = ["Title", "Authors", "Price", "State"];
  } else {
    response.answer = `Found ${results.length} result(s) for your question.`;
  }

  return response;
}
