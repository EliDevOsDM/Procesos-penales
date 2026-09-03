import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDtJv6NJfV81P_UMd9gFw7Eq85cgqIYjUQ",
  authDomain: "procesos-penales.firebaseapp.com",
  projectId: "procesos-penales",
  storageBucket: "procesos-penales.firebasestorage.app",
  messagingSenderId: "1022879049555",
  appId: "1:1022879049555:web:16a270326e3c372ddd23a6",
  measurementId: "G-L0F6ZRL98S",
};

const app = initializeApp(firebaseConfig);

export { app };
export const auth = getAuth(app);
export const db = getFirestore(app);
