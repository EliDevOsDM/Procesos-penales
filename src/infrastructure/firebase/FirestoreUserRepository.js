import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config.js";
import { IUserRepository } from "../../domain/repositories/IUserRepository.js";
import { UserProfile } from "../../domain/entities/UserProfile.js";

const COLLECTION = "users";

const toUser = (snapshot) => new UserProfile({ uid: snapshot.id, ...snapshot.data() });

export class FirestoreUserRepository extends IUserRepository {
  async getAll() {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(toUser);
  }

  async getByUid(uid) {
    const snapshot = await getDoc(doc(db, COLLECTION, uid));
    return snapshot.exists() ? toUser(snapshot) : null;
  }

  async save(userProfile) {
    await setDoc(doc(db, COLLECTION, userProfile.uid), {
      email: userProfile.email,
      name: userProfile.name,
      roleId: userProfile.roleId,
      createdAt: serverTimestamp(),
    });
    return userProfile;
  }

  async assignRole(uid, roleId) {
    await setDoc(doc(db, COLLECTION, uid), { roleId }, { merge: true });
  }
}
