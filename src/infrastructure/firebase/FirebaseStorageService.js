import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { app } from "./config.js";

const storage = getStorage(app);

export class FirebaseStorageService {
  async uploadPdf(file, path) {
    if (!file || file.type !== "application/pdf") {
      throw new Error("Solo se permiten archivos PDF.");
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("El PDF no puede superar 10 MB.");
    }
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file, { contentType: "application/pdf" });
    const url = await getDownloadURL(storageRef);
    return { url, name: file.name, path };
  }

  async remove(path) {
    if (!path) return;
    await deleteObject(ref(storage, path));
  }
}
