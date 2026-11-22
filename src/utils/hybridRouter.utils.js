import { models } from "../config/firebase.config.js";
import {
  buildPrompt,
  getInferenceErrorMessage,
  getSubmissionValidationMessage,
} from "./inference.utils.js";

const sessionOptions = {
  expectedInputs: [{ type: "text", languages: ["en"] }],
  expectedOutputs: [{ type: "text", languages: ["en"] }],
};

export async function checkLocalNanoStatus() {
  if (typeof window === "undefined" || !("LanguageModel" in window)) {
    return "unavailable";
  }
  try {
    return await window.LanguageModel.availability(sessionOptions); // "available" | "downloadable" | "downloading" | "unavailable"
  } catch {
    return "unavailable";
  }
}

export async function runHybridInference({ taskType, userCode, forceOffline }) {
  const startTime = performance.now();
  const nanoStatus = await checkLocalNanoStatus();
  const validationMessage = getSubmissionValidationMessage(userCode);
  if (validationMessage) {
    return {
      ok: false,
      text: validationMessage,
      latencyMs: Math.round(performance.now() - startTime),
      executionSource: "error",
      nanoStatus,
    };
  }

  const isCloudTask = taskType === "CLOUD_POSTMORTEM";

  let selectedModel = models.hybridLocal;
  if (isCloudTask) {
    selectedModel = models.cloudDeep;
  } else if (forceOffline) {
    selectedModel = models.strictLocal;
  }

  try {
    const prompt = buildPrompt(taskType, userCode);
    const result = await selectedModel.generateContent(prompt);
    const text = result.response.text();
    const latencyMs = Math.round(performance.now() - startTime);

    let executionSource = "cloud-fallback";
    if (isCloudTask) {
      executionSource = "cloud";
    } else if (forceOffline || nanoStatus === "available") {
      executionSource = "on-device";
    }

    return {
      ok: true,
      text,
      latencyMs,
      executionSource,
      nanoStatus,
    };
  } catch (error) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      ok: false,
      text: getInferenceErrorMessage({
        taskType,
        forceOffline,
        nanoStatus,
        isOnline: typeof navigator === "undefined" || navigator.onLine,
        error,
      }),
      latencyMs,
      executionSource: "error",
      nanoStatus,
    };
  }
}
