import { disableNetwork, enableNetwork } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { db } from "../config/firebase.config.js";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const updateFirestoreNetwork = isOnline ? enableNetwork : disableNetwork;

    updateFirestoreNetwork(db).catch((error) => {
      console.error("Firestore network status error:", error);
      toast.error("Could not update the cloud connection status.");
    });
  }, [isOnline]);

  return isOnline;
}
