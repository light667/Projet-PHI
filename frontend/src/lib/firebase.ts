import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent, isSupported, Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAohh5B_ekXS4-HysaVdnhrXsvvjRYpXI0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "phi-org.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "phi-org",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "phi-org.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1013830917082",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1013830917082:web:216f11911c6cd937017ee3",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1E6C0EVRXM"
};

export const app = initializeApp(firebaseConfig);

let analytics: Analytics | null = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export const trackPageView = (path: string) => {
  if (analytics) {
    logEvent(analytics, "page_view", {
      page_path: path,
      page_title: document.title
    });
  }
};
