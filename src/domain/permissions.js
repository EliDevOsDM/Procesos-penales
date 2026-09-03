// Un "permiso" ahora es el acceso a uno de los 3 módulos CRUD.
import { MODULE_LIST, ALL_MODULE_KEYS } from "./modules.js";

export const ALL_PERMISSIONS = ALL_MODULE_KEYS;

export const PERMISSION_LABELS = Object.fromEntries(
  MODULE_LIST.map((m) => [m.key, m.navLabel || m.label])
);
