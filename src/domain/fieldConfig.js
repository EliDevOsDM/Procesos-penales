/** Campos que siempre son obligatorios (no se pueden desmarcar). */
export const ALWAYS_REQUIRED = {
  procesos_penales: ["procesados"],
};

export function getDefaultRequiredFields(module) {
  const always = ALWAYS_REQUIRED[module.key] ?? [];
  const fromModule = module.fields
    .filter((f) => f.required && !f.readOnly && !f.computed && !f.autoId)
    .map((f) => f.name);
  return [...new Set([...always, ...fromModule])];
}

export function getConfigurableFields(module) {
  return module.fields.filter((f) => !f.readOnly && !f.computed && !f.autoId);
}

export function isFieldRequired(fieldName, requiredFields, moduleKey) {
  const always = ALWAYS_REQUIRED[moduleKey] ?? [];
  return always.includes(fieldName) || requiredFields.includes(fieldName);
}
