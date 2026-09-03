import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./config.js";
import { getDefaultRequiredFields } from "../../domain/fieldConfig.js";
import { getModule } from "../../domain/modules.js";

const COLLECTION = "field_config";

export class FirestoreFieldConfigRepository {
  async getRequiredFields(moduleKey) {
    const module = getModule(moduleKey);
    const defaults = module ? getDefaultRequiredFields(module) : [];
    try {
      const snapshot = await getDoc(doc(db, COLLECTION, moduleKey));
      if (!snapshot.exists()) {
        await setDoc(doc(db, COLLECTION, moduleKey), { requiredFields: defaults });
        return defaults;
      }
      const stored = snapshot.data().requiredFields ?? [];
      return [...new Set([...defaults, ...stored])];
    } catch (err) {
      console.error("Error cargando campos obligatorios:", err);
      return defaults;
    }
  }

  async saveRequiredFields(moduleKey, requiredFields) {
    const module = getModule(moduleKey);
    const defaults = module ? getDefaultRequiredFields(module) : [];
    const merged = [...new Set([...defaults, ...requiredFields])];
    await setDoc(doc(db, COLLECTION, moduleKey), { requiredFields: merged });
    return merged;
  }
}
