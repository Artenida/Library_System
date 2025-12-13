export const INSIGHTS_PROMPT = (books: string, username: string) =>
  `You are a library assistant. Based on the following user reading data, provide a short summary and insights for ${username}:

    ${books}

    Write 3-4 summary bullet points.
    Write 2-3 actionable insights.
    Use this format exactly:

    Summary:
    - point 1
    - point 2
    - point 3

    Insights:
    - actionable 1
    - actionable 2
    `;
