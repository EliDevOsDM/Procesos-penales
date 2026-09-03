import { isFieldRequired } from "../../domain/fieldConfig.js";
import { parseCOPNumber } from "../../domain/currency.js";
import { toUpperText, shouldUppercaseField } from "../../domain/textNormalize.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function nextRegistroId(repository) {
  const items = await repository.getAll();
  const max = items.reduce(
    (acc, item) => Math.max(acc, Number(item.registro_id) || 0),
    0
  );
  return max + 1;
}

export function makeCrudUseCases(
  repository,
  module,
  catalogRepository,
  fieldConfigRepository
) {
  const requireAccess = (role) => {
    if (!role || !role.hasPermission(module.key)) {
      throw new Error(`No tienes acceso al módulo ${module.label}.`);
    }
  };

  const requireWrite = (role) => {
    requireAccess(role);
    if (!role.hasWritePermission(module.key)) {
      throw new Error(`No tienes permiso para modificar ${module.label}.`);
    }
  };

  const validate = async (data) => {
    const requiredFields = await fieldConfigRepository.getRequiredFields(module.key);

    for (const field of module.fields) {
      if (field.autoId || field.readOnly) continue;

      const value = data[field.name];
      const required = isFieldRequired(field.name, requiredFields, module.key);

      if (required && !String(value ?? "").trim()) {
        throw new Error(`El campo "${field.label}" es obligatorio.`);
      }
      if (field.validate23 && String(value ?? "").trim()) {
        const digits = String(value).replace(/\D/g, "");
        if (digits.length !== 23) {
          throw new Error(`${field.label}: debe tener exactamente 23 dígitos.`);
        }
      }
      if (field.type === "email" && String(value ?? "").trim()) {
        if (!EMAIL_RE.test(String(value).trim())) {
          throw new Error(`El campo "${field.label}" debe ser un correo válido.`);
        }
      }
      if (field.type === "currency" && String(value ?? "").trim() !== "") {
        const n = parseCOPNumber(value);
        if (n == null || Number.isNaN(n) || n < 0) {
          throw new Error(`El campo "${field.label}" debe ser un número válido.`);
        }
      }
    }
  };

  const normalize = (data) => {
    const clean = {};
    for (const field of module.fields) {
      if (field.autoId) continue;

      const value = data[field.name];
      if (field.type === "currency") {
        clean[field.name] = parseCOPNumber(value);
      } else if (field.type === "date") {
        clean[field.name] = value || null;
      } else if (field.type === "number") {
        const n = Number(String(value ?? "").replace(/\D/g, ""));
        clean[field.name] = Number.isNaN(n) ? null : n;
      } else {
        const trimmed = String(value ?? "").trim() || null;
        clean[field.name] =
          trimmed && shouldUppercaseField(field) ? toUpperText(trimmed) : trimmed;
      }
    }

    if (data.registro_id != null && data.registro_id !== "") {
      clean.registro_id = Number(data.registro_id);
    }

    clean.actuaciones = Array.isArray(data.actuaciones)
      ? data.actuaciones
          .filter((a) => a.actuacion?.trim())
          .map((a) => ({
            fecha: a.fecha || null,
            actuacion: toUpperText(a.actuacion.trim()),
          }))
      : [];
    clean.referencia = data.referencia || null;
    return clean;
  };

  return {
    list: async (role) => {
      requireAccess(role);
      const items = await repository.getAll();
      return items.sort(
        (a, b) => (Number(a.registro_id) || 0) - (Number(b.registro_id) || 0)
      );
    },

    getCatalogs: () => catalogRepository.getModuleCatalogs(module.key),

    getRequiredFields: () => fieldConfigRepository.getRequiredFields(module.key),

    create: async (role, data) => {
      requireWrite(role);
      await validate(data);
      const payload = normalize(data);
      payload.registro_id = await nextRegistroId(repository);
      return repository.create(payload);
    },

    update: async (role, id, data) => {
      requireWrite(role);
      await validate(data);
      return repository.update(id, normalize(data));
    },

    remove: async (role, id) => {
      requireWrite(role);
      return repository.remove(id);
    },

    importRows: async (role, rows) => {
      requireWrite(role);
      const result = { created: 0, errors: [] };
      let nextId = await nextRegistroId(repository);

      for (const { excelRow, data } of rows) {
        try {
          if (!data.registro_id) {
            data.registro_id = nextId;
            nextId += 1;
          }
          await validate(data);
          await repository.create(normalize(data));
          result.created += 1;
        } catch (err) {
          result.errors.push({ row: excelRow, message: err.message });
        }
      }

      return result;
    },
  };
}
