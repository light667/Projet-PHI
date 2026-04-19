import { initializeApp } from 'firebase/app';

// Fichier Firebase de remplacement (Mock) pour éviter le crash de l'import
const mockConfig = {
  apiKey: "mock-key",
  authDomain: "mock.firebaseapp.com",
  projectId: "mock-project",
  storageBucket: "mock.appspot.com",
  messagingSenderId: "000000000",
  appId: "1:000000000:web:0000000"
};

export const app = initializeApp(mockConfig);

export const trackPageView = (path: string) => {
  console.log(`Page view tracked: ${path}`);
  // Insérez ici le vrai code d'analytics firebase si nécessaire
};
