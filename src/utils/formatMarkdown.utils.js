export function cleanMarkdown(text = "") {
  return text
    .replace(/^```(?:markdown|md)?\s*\n/i, "")
    .replace(/\n```\s*$/i, "")
    .trim();
}
