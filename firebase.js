import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCtW6EM4YeJ5fv9gz5IFmCojXJrkGkWr_o",
  authDomain: "nexus-app-321c0.firebaseapp.com",
  projectId: "nexus-app-321c0",
  storageBucket: "nexus-app-321c0.firebasestorage.app",
  messagingSenderId: "753056026315",
  appId: "1:753056026315:web:757d646da56efecaf0554e"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);