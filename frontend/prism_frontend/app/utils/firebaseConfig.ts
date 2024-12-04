// utils/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA_efFr9P3dMUVfZDbc___Bpwi7vFqM2mQ",
  authDomain: "prism-1b335.firebaseapp.com",
  projectId: "prism-1b335",
  storageBucket: "prism-1b335.firebasestorage.app",
  messagingSenderId: "51238026148",
  appId: "1:51238026148:web:6b2653cd33238b8c239f31"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };