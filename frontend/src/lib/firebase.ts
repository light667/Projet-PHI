import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAohh5B_ekXS4-HysaVdnhrXsvvjRYpXI0",
  authDomain: "phi-org.firebaseapp.com",
  projectId: "phi-org",
  storageBucket: "phi-org.firebasestorage.app",
  messagingSenderId: "1013830917082",
  appId: "1:1013830917082:web:216f11911c6cd937017ee3",
  measurementId: "G-1E6C0EVRXM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
