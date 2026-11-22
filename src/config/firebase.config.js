import {
  getAI,
  getGenerativeModel,
  GoogleAIBackend,
  InferenceMode,
} from "firebase/ai";
import { initializeApp } from "firebase/app";
import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from "firebase/app-check";
import { getAuth, signInAnonymously } from "firebase/auth";
import {
  enableIndexedDbPersistence,
  getFirestore,
  setLogLevel,
} from "firebase/firestore";

setLogLevel("silent");

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

if (recaptchaSiteKey) {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
}

export const db = getFirestore(app);

enableIndexedDbPersistence(db).catch((err) => {
  console.warn("Firestore persistence warning:", err?.code || err);
});

export const signInGuest = () => signInAnonymously(getAuth(app));

const ai = getAI(app, { backend: new GoogleAIBackend() });

export const models = {
  // Uses Gemini Nano on-device if available, automatically falls back to Cloud Gemini
  hybridLocal: getGenerativeModel(ai, {
    mode: InferenceMode.PREFER_ON_DEVICE,
  }),
  // Strictly runs on-device (used when Offline Simulator is toggled ON)
  strictLocal: getGenerativeModel(ai, {
    mode: InferenceMode.ONLY_ON_DEVICE,
  }),
  // Strictly runs in Cloud Gemini for heavy edge-case generation & post-mortem
  cloudDeep: getGenerativeModel(ai, {
    mode: InferenceMode.ONLY_IN_CLOUD,
  }),
};
