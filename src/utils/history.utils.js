export function getRestorableSession(item) {
  if (
    typeof item.userCode !== "string" ||
    typeof item.coachOutput !== "string"
  ) {
    return null;
  }

  return {
    code: item.userCode,
    result: {
      ok: item.ok !== false,
      text: item.coachOutput,
      executionSource: item.executionSource || "unknown",
      latencyMs: item.latencyMs ?? 0,
      nanoStatus: item.nanoStatus || "unknown",
    },
  };
}
