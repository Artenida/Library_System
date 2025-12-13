interface AIInsight {
  summary: string[];       
  actionable: string[];    
}

export function parseAIInsights(rawText: string): AIInsight {
  const lines = rawText.split("\n").map(line => line.trim()).filter(Boolean);

  const summary: string[] = [];
  const actionable: string[] = [];
  let currentSection: "summary" | "actionable" | null = null;

  for (const line of lines) {
    if (/^Summary/i.test(line)) {
      currentSection = "summary";
      continue;
    }
    if (/^Insights/i.test(line) || /^Actionable/i.test(line)) {
      currentSection = "actionable";
      continue;
    }

    // Remove leading dashes or bullets
    const cleanLine = line.replace(/^[-•]\s*/, "");

    if (currentSection === "summary") summary.push(cleanLine);
    else if (currentSection === "actionable") actionable.push(cleanLine);
  }

  return { summary, actionable };
}