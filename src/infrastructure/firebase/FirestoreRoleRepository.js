import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./config.js";
import { IRoleRepository } from "../../domain/repositories/IRoleRepository.js";
import { Role } from "../../domain/entities/Role.js";

const COLLECTION = "roles";

const toRole = (snapshot) => new Role({ id: snapshot.id, ...snapshot.data() });

export class FirestoreRoleRepository extends IRoleRepository {
  async getAll() {
    const snapshot = await getDocs(collection(db, COLLECTION));
    return snapshot.docs.map(toRole);
  }

  async getById(id) {
    const snapshot = await getDoc(doc(db, COLLECTION, id));
    return snapshot.exists() ? toRole(snapshot) : null;
  }

  async create(role) {
    const ref = await addDoc(collection(db, COLLECTION), {
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      readOnlyPermissions: role.readOnlyPermissions ?? [],
      isAdmin: role.isAdmin,
    });
    role.id = ref.id;
    return role;
  }

  async update(role) {
    await updateDoc(doc(db, COLLECTION, role.id), {
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      readOnlyPermissions: role.readOnlyPermissions ?? [],
      isAdmin: role.isAdmin,
    });
    return role;
  }

  async remove(id) {
    await deleteDoc(doc(db, COLLECTION, id));
  }
}
