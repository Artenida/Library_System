export interface AIInsight {
  summary: string[];
  actionable: string[];
}

export function parseAIInsights(raw: string): AIInsight {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const summary: string[] = [];
  const actionable: string[] = [];
  let section: "summary" | "actionable" | null = null;

  for (const line of lines) {
    if (/^summary/i.test(line)) {
      section = "summary";
      continue;
    }
    if (/^insights|actionable/i.test(line)) {
      section = "actionable";
      continue;
    }

    const clean = line.replace(/^[-•]\s*/, "");
    if (section === "summary") summary.push(clean);
    if (section === "actionable") actionable.push(clean);
  }

  return { summary, actionable };
}
