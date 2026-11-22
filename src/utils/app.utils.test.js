import assert from "node:assert/strict";
import test from "node:test";
import { loadDraft, saveDraft } from "./draftStorage.utils.js";
import { getRestorableSession } from "./history.utils.js";
import {
  buildPrompt,
  getInferenceErrorMessage,
  getSubmissionValidationMessage,
} from "./inference.utils.js";

test("buildPrompt uses the submitted text without adding a sample problem", () => {
  const submission = "function myAlgorithm(input) { return input; }";
  const prompt = buildPrompt("CONCEPT_NUDGE", submission);

  assert.ok(prompt.includes(submission));
  assert.ok(
    prompt.includes("Do not assume it refers to a known sample problem"),
  );
});

test("empty or whitespace-only submissions are rejected", () => {
  assert.match(getSubmissionValidationMessage(" \n\t "), /Paste or write/);
  assert.equal(getSubmissionValidationMessage("const answer = 42;"), null);
});

test("offline errors explain whether Nano or internet is needed", () => {
  const nanoUnavailable = getInferenceErrorMessage({
    taskType: "CONCEPT_NUDGE",
    forceOffline: true,
    nanoStatus: "unavailable",
    isOnline: false,
  });
  assert.match(nanoUnavailable, /Gemini Nano is not available/);

  const cloudUnavailable = getInferenceErrorMessage({
    taskType: "CLOUD_POSTMORTEM",
    forceOffline: false,
    nanoStatus: "available",
    isOnline: false,
  });
  assert.match(cloudUnavailable, /needs an internet connection/);
});

test("draft storage saves and restores the exact user text", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const draft = "  function preserveWhitespace() {}\n";

  saveDraft(draft, storage);
  assert.equal(loadDraft(storage), draft);
});

test("activity history restores its submitted text and coach response", () => {
  const restored = getRestorableSession({
    userCode: "const submission = true;",
    coachOutput: "Consider the boundary case.",
    ok: true,
    executionSource: "on-device",
    latencyMs: 120,
    nanoStatus: "available",
  });

  assert.equal(restored.code, "const submission = true;");
  assert.equal(restored.result.text, "Consider the boundary case.");
  assert.equal(restored.result.executionSource, "on-device");
});

test("metadata-only older activity is not restorable", () => {
  assert.equal(
    getRestorableSession({ taskType: "CONCEPT_NUDGE", latencyMs: 100 }),
    null,
  );
});
