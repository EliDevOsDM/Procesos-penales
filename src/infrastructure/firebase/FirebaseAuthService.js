import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "./config.js";

export class FirebaseAuthService {
  login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  logout() {
    return signOut(auth);
  }

  onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
  }
}
