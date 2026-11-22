import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { signInGuest } from "../config/firebase.config.js";
import {
  deleteHintLog,
  subscribeHintLogs,
} from "../services/hintLogs.service.js";
import { getRestorableSession } from "../utils/history.utils.js";

export function useHintHistory(isOnline, setCode, setActiveResult) {
  const [userId, setUserId] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!isOnline || userId) return undefined;

    let active = true;

    signInGuest()
      .then((cred) => {
        if (active) setUserId(cred.user.uid);
      })
      .catch((error) => {
        console.error("Auth error:", error);
        toast.error("Cloud sign-in failed. Recent activity is unavailable.");
      });

    return () => {
      active = false;
    };
  }, [isOnline, userId]);

  useEffect(() => {
    if (!userId || !isOnline) return undefined;

    return subscribeHintLogs(userId, setHistory, (error) => {
      console.error("Hint history error:", error);
      toast.error("Could not load recent hint activity.");
    });
  }, [userId, isOnline]);

  const handleOpenHistoryItem = useCallback(
    (item) => {
      const session = getRestorableSession(item);

      if (!session) return;

      setCode(session.code);
      setActiveResult(session.result);

      toast.success("Activity restored to the editor and Coach Output.");
    },
    [setActiveResult, setCode],
  );

  const handleDeleteHistoryItem = useCallback(
    (itemId) => {
      if (!userId) return;

      const notificationId = isOnline
        ? toast.loading("Deleting activity...")
        : null;

      if (!isOnline) toast("Delete queued until you reconnect.");

      deleteHintLog(userId, itemId)
        .then(() => {
          if (notificationId) {
            toast.success("Activity deleted.", { id: notificationId });
          }
        })
        .catch((error) => {
          console.error("Hint log delete error:", error);
          if (notificationId) {
            toast.error("Could not delete this activity. Please try again.", {
              id: notificationId,
            });
          } else {
            toast.error("Could not delete this activity. Please try again.");
          }
        });
    },
    [isOnline, userId],
  );

  return {
    handleDeleteHistoryItem,
    handleOpenHistoryItem,
    history,
    userId,
  };
}
