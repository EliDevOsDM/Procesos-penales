import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config.js";
import { DEFAULT_CATALOGS } from "../../domain/catalogs.js";

const COLLECTION = "catalogs";

export class FirestoreCatalogRepository {
  async getModuleCatalogs(moduleKey) {
    const defaults = DEFAULT_CATALOGS[moduleKey] ?? {};
    try {
      const snapshot = await getDoc(doc(db, COLLECTION, moduleKey));
      if (!snapshot.exists()) {
        await setDoc(doc(db, COLLECTION, moduleKey), defaults);
        return defaults;
      }
      return { ...defaults, ...snapshot.data() };
    } catch (err) {
      console.error("Error cargando catálogos, usando valores por defecto:", err);
      return defaults;
    }
  }

  async saveModuleCatalogs(moduleKey, catalogs) {
    await setDoc(doc(db, COLLECTION, moduleKey), catalogs, { merge: true });
    return catalogs;
  }

  async updateList(moduleKey, listKey, items) {
    const catalogs = await this.getModuleCatalogs(moduleKey);
    catalogs[listKey] = items;
    await this.saveModuleCatalogs(moduleKey, catalogs);
    return catalogs;
  }
}
