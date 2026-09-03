import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./config.js";
import { ICrudRepository } from "../../domain/repositories/ICrudRepository.js";

export class FirestoreCrudRepository extends ICrudRepository {
  constructor(collectionName) {
    super();
    this.collectionName = collectionName;
  }

  async getAll() {
    const snapshot = await getDocs(collection(db, this.collectionName));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  async create(data) {
    const ref = await addDoc(collection(db, this.collectionName), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { id: ref.id, ...data };
  }

  async update(id, data) {
    await updateDoc(doc(db, this.collectionName, id), data);
    return { id, ...data };
  }

  async patch(id, partial) {
    await updateDoc(doc(db, this.collectionName, id), partial);
  }

  async remove(id) {
    await deleteDoc(doc(db, this.collectionName, id));
  }
}
