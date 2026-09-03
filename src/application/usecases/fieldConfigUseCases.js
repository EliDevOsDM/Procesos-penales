import { ALWAYS_REQUIRED } from "../../domain/fieldConfig.js";

export function makeFieldConfigUseCases(fieldConfigRepository) {
  return {
    getRequiredFields: (moduleKey) =>
      fieldConfigRepository.getRequiredFields(moduleKey),

    saveRequiredFields: async (moduleKey, selectedFields) => {
      const always = ALWAYS_REQUIRED[moduleKey] ?? [];
      const merged = [...new Set([...always, ...selectedFields])];
      return fieldConfigRepository.saveRequiredFields(moduleKey, merged);
    },
  };
}
