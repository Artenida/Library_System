export const formatHeader = (key: string) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export const formatCell = (value: any, key: string) => {
  if (!value) return "-";

  if (key === "published_date") {
    return new Date(value).toLocaleDateString();
  }

  if (key === "price") {
    return `$${Number(value).toFixed(2)}`;
  }

  return value;
};
