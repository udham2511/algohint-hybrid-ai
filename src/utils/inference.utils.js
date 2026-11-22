export function buildPrompt(taskType, userCode) {
  const baseContext = `Analyze only the user's submission below. It may contain a problem statement, code, or both. Do not assume it refers to a known sample problem; if key information is missing, say so.\n\nUser submission:\n\`\`\`\n${userCode}\n\`\`\``;

  switch (taskType) {
    case "CONCEPT_NUDGE":
      return `You are a strict Socratic DSA tutor. Give a Concept Nudge for the student's submission.
RULE: NEVER write code or name the exact solution line-by-line. Respond in at most 2 concise bullet points (under 45 words total) pointing toward the right data structure or algorithmic paradigm.
${baseContext}`;

    case "COMPLEXITY_CHECK":
      return `You are a strict Socratic DSA tutor. Analyze the Time & Space complexity of the submitted code.
RULE: NEVER write code. Respond in at most 2 concise bullet points (under 45 words total). If the submission does not provide constraints or a clear task, state what cannot be determined.
${baseContext}`;

    case "EDGE_CASE_GUARD":
      return `You are a strict Socratic DSA tutor. Identify ONE concrete edge case or subtle bug in the submitted code (e.g., empty input, duplicates, off-by-one).
RULE: NEVER write code fixes. Respond in at most 2 concise bullet points (under 45 words total) with a small failing input example.
${baseContext}`;

    case "CLOUD_POSTMORTEM":
      return `You are a senior technical interviewer conducting a deep post-mortem. Provide a well-structured markdown breakdown with 3 sections:
1. **Complexity Trade-Offs:** Compare the student's current Time/Space complexity vs. the optimal approach.
2. **5 Adversarial Edge Cases:** Provide 5 tricky test inputs (boundary, negative, duplicates, max constraints) with expected outputs.
3. **2 Follow-Up Problems:** Suggest 2 related algorithmic problems that reinforce this pattern.
${baseContext}`;

    default:
      return baseContext;
  }
}

export function getSubmissionValidationMessage(userCode) {
  return userCode.trim()
    ? null
    : "Paste or write your problem statement or code before requesting a hint.";
}

export function getInferenceErrorMessage({
  taskType,
  forceOffline,
  nanoStatus,
  isOnline,
  error,
}) {
  if (forceOffline && nanoStatus !== "available") {
    return "Gemini Nano is not available in this browser. Download or enable Nano, or turn off Offline Mode to use cloud fallback.";
  }

  if (!isOnline && taskType === "CLOUD_POSTMORTEM") {
    return "Cloud Post-Mortem needs an internet connection. Reconnect and try again.";
  }

  if (!isOnline && nanoStatus !== "available") {
    return "You are offline and Gemini Nano is unavailable. Reconnect, or make Nano available to run local hints offline.";
  }

  if (forceOffline) {
    return `Gemini Nano could not complete this request: ${error?.message || "unknown error"}. Check Nano availability and try again.`;
  }

  return `Inference request failed: ${error?.message || "unknown error"}. Check your connection and try again.`;
}
