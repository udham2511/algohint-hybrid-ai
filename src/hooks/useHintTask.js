import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { saveHintLog } from "../services/hintLogs.service.js";
import {
  checkLocalNanoStatus,
  runHybridInference,
} from "../utils/hybridRouter.utils.js";

export function useHintTask({
  code,
  forceOffline,
  isOnline,
  userId,
  setActiveResult,
}) {
  const [nanoStatus, setNanoStatus] = useState("checking...");
  const [loadingTask, setLoadingTask] = useState(null);

  useEffect(() => {
    checkLocalNanoStatus().then(setNanoStatus);
  }, []);

  const handleTriggerTask = useCallback(
    async (taskType) => {
      setLoadingTask(taskType);

      try {
        const response = await runHybridInference({
          taskType,
          userCode: code,
          forceOffline,
        });

        setActiveResult(response);
        setNanoStatus(response.nanoStatus);

        if (userId) {
          const savePromise = saveHintLog(userId, {
            problemId: "user-submission",
            problemTitle: "User submission",
            taskType,
            userCode: code,
            coachOutput: response.text,
            ok: response.ok,
            executionSource: response.executionSource,
            latencyMs: response.latencyMs,
            nanoStatus: response.nanoStatus,
          });

          const handleSaveError = (error) => {
            console.error("Hint log save error:", error);
            toast.error("Could not save this activity to your account.");
          };

          if (isOnline) {
            savePromise
              .then(() => toast.success("Hint saved to recent activity."))
              .catch(handleSaveError);
          } else {
            toast("Activity will sync when you reconnect.");
            savePromise.catch(handleSaveError);
          }
        }
      } catch (error) {
        console.error("Task error:", error);
        toast.error(error.message || "Unable to run the analysis.");

        setActiveResult({
          ok: false,
          text: `Unable to run the analysis: ${error.message}`,
          latencyMs: 0,
          executionSource: "error",
          nanoStatus: "unknown",
        });
      } finally {
        setLoadingTask(null);
      }
    },
    [code, forceOffline, isOnline, setActiveResult, userId],
  );

  return {
    handleTriggerTask,
    loadingTask,
    nanoStatus,
  };
}
