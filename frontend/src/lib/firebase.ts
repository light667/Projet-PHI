import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { initializeApp, getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyAohh5B_ekXS4-HysaVdnhrXsvvjRYpXI0",
  authDomain: "phi-org.firebaseapp.com",
  projectId: "phi-org",
  storageBucket: "phi-org.firebasestorage.app",
  messagingSenderId: "1013830917082",
  appId: "1:1013830917082:web:216f11911c6cd937017ee3",
  measurementId: "G-1E6C0EVRXM"
};

// Initialize Firebase (prevent double init)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Analytics only in browser (not SSR) and only if supported
let analytics: ReturnType<typeof getAnalytics> | null = null;

isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { app, analytics };

// Helper to safely log analytics events
export function trackEvent(eventName: string, params?: Record<string, string>) {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
}

// Helper to track page views on route change
export function trackPageView(pagePath: string) {
  if (analytics) {
    logEvent(analytics, 'page_view', {
      page_path: pagePath,
      page_title: document.title,
    });
  }
}
