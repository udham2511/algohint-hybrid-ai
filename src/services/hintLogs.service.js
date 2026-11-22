import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase.config.js";

const getHintLogsCollection = (userId) =>
  collection(db, "users", userId, "hintLogs");

export function subscribeHintLogs(userId, onChange, onError) {
  const hintLogsQuery = query(
    getHintLogsCollection(userId),
    orderBy("createdAt", "desc"),
    limit(10),
  );

  return onSnapshot(
    hintLogsQuery,
    (snapshot) => {
      onChange(
        snapshot.docs.map((snapshotDoc) => ({
          id: snapshotDoc.id,
          ...snapshotDoc.data(),
        })),
      );
    },
    onError,
  );
}

export function saveHintLog(userId, hintLog) {
  return addDoc(getHintLogsCollection(userId), {
    ...hintLog,
    createdAt: serverTimestamp(),
  });
}

export function deleteHintLog(userId, hintLogId) {
  return deleteDoc(doc(getHintLogsCollection(userId), hintLogId));
}
