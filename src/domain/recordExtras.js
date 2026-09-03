import { MODULES } from "./modules.js";

export const todayISO = () => new Date().toISOString().slice(0, 10);

export function emptyActuacion() {
  return { fecha: todayISO(), actuacion: "" };
}

export function buildRecordPayload(form, module, extras) {
  const payload = { ...form };
  for (const field of module.fields) {
    payload[field.name] = form[field.name];
  }
  payload.actuaciones = extras.actuaciones || [];
  payload.referencia = extras.referencia || null;
  return payload;
}

export const EXTRA_FIELD_KEYS = ["actuaciones", "referencia"];

export function isExtraField(name) {
  return EXTRA_FIELD_KEYS.includes(name);
}

export const MODULES_EXPORT = MODULES;
