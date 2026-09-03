/**
 * Genera catalogs.js desde Procesos Penales.xlsx (hoja Lista).
 * Ejecutar: node scripts/generate-procesos-penales-data.js
 */
import XLSX from "xlsx";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const excelPath = path.join(root, "Procesos Penales.xlsx");

function slugify(header) {
  return String(header ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .replace(/_+/g, "_");
}

function fieldType(header, typeHint) {
  const h = String(header ?? "");
  const t = String(typeHint ?? "").toUpperCase();

  if (h === "ID") {
    return { type: "number", readOnly: true, autoId: true, table: true };
  }
  if (h === "ACTUACIONES") {
    return null;
  }
  if (t.includes("LISTA")) {
    return { type: "select", catalogKey: slugify(h) };
  }
  if (t.includes("CAMPO FECHA") || (t.includes("FECHA") && t.includes("ALERTA"))) {
    return { type: "date", alertDate: t.includes("ALERTA") };
  }
  if (
    t.includes("TEXTO AMPLIO") ||
    h === "HECHOS" ||
    h === "OBSERVACIONES" ||
    h.includes("DESCRIPCION") ||
    h === "RESUMEN DE ACTUACION ANTERIOR"
  ) {
    return { type: "textarea", fullWidth: true };
  }
  return { type: "text" };
}

const TABLE_HEADERS = new Set([
  "ID",
  "PROCESADOS",
  "CAUSA",
  "CALIDAD EN LA QUE ACTUA EL MEN",
  "RADICADO",
  "ETAPA PROCESAL ACTUAL",
  "ESTADO DEL PROCESO",
]);

const wb = XLSX.readFile(excelPath);
const activos = XLSX.utils.sheet_to_json(wb.Sheets["Activos"], { header: 1, defval: "" });
const headers = activos[1];
const typeHints = activos[2];

const lista = XLSX.utils.sheet_to_json(wb.Sheets["Lista"], { header: 1, defval: "" });
const listaHeaders = lista[0];

const catalogsBySlug = {};

for (let c = 0; c < listaHeaders.length; c++) {
  const key = slugify(listaHeaders[c]);
  const vals = new Set();
  for (let r = 1; r < lista.length; r++) {
    const v = String(lista[r][c] ?? "").trim();
    if (v) vals.add(v);
  }
  catalogsBySlug[key] = [...vals].sort((a, b) => a.localeCompare(b, "es"));
}

const fields = [];
const catalogLabels = {};
const catalogsForModule = {};

for (let i = 0; i < headers.length; i++) {
  const label = headers[i];
  if (!label) continue;

  const cfg = fieldType(label, typeHints[i]);
  if (!cfg) continue;

  const name = label === "ID" ? "registro_id" : slugify(label);
  const field = {
    name,
    label,
    ...cfg,
    ...(TABLE_HEADERS.has(label) ? { table: true } : {}),
  };

  if (field.type === "select") {
    catalogsForModule[field.catalogKey] = catalogsBySlug[field.catalogKey] || [];
    catalogLabels[field.catalogKey] = label;
  }

  fields.push(field);
}

const catalogsOut = `// Generado desde Procesos Penales.xlsx — no editar a mano; ejecutar scripts/generate-procesos-penales-data.js
export const DEFAULT_CATALOGS = {
  procesos_penales: ${JSON.stringify(catalogsForModule, null, 2).replace(/"([^"]+)":/g, "$1:")},
};

export const getCatalogs = (moduleKey) => DEFAULT_CATALOGS[moduleKey] ?? {};

export const CATALOG_LABELS = {
  procesos_penales: ${JSON.stringify(catalogLabels, null, 2).replace(/"([^"]+)":/g, "$1:")},
};
`;

fs.writeFileSync(path.join(root, "src/domain/catalogs.js"), catalogsOut, "utf8");
console.log("Wrote src/domain/catalogs.js");

const modulesOut = `// Módulo Procesos Penales — campos desde Procesos Penales.xlsx
// Regenerar listas: node scripts/generate-procesos-penales-data.js

export const MODULES = {
  PROCESOS_PENALES: "procesos_penales",
};

const procesosPenalesFields = ${JSON.stringify(fields, null, 2)};

export const MODULE_LIST = [
  {
    key: MODULES.PROCESOS_PENALES,
    label: "Procesos Penales",
    navLabel: "Procesos Penales",
    crudName: "Procesos Penales",
    excelName: "Procesos Penales",
    collection: "procesos_penales",
    computeFields: null,
    estadoField: "estado_del_proceso",
    estadoCatalogKey: "estado_del_proceso",
    fields: procesosPenalesFields,
  },
];

export const ALL_MODULE_KEYS = MODULE_LIST.map((m) => m.key);
export const getModule = (key) => MODULE_LIST.find((m) => m.key === key);
`;

fs.writeFileSync(path.join(root, "src/domain/modules.js"), modulesOut, "utf8");
console.log("Wrote src/domain/modules.js");

const excelColumns = fields.map((f, idx) => {
  const col = { col: headers.indexOf(f.label), field: f.name, header: f.label };
  if (f.type === "date") col.type = "date";
  return col;
}).filter((c) => c.col >= 0);

const excelConfigOut = `import { MODULES } from "../../domain/modules.js";

/** Columnas Procesos Penales.xlsx — hoja Activos (encabezado fila 2, datos fila 4+) */
export const PROCESOS_PENALES_COLUMNS = ${JSON.stringify(excelColumns, null, 2)};

export const EXCEL_MODULE_CONFIG = {
  [MODULES.PROCESOS_PENALES]: {
    sheetNames: ["Activos"],
    mainSheetName: "Activos",
    actuacionesSheetName: "Actuaciones",
    fileName: "Procesos Penales.xlsx",
    headerRow: 0,
    dataStartRow: 1,
    keyField: "registro_id",
    keyHeader: "ID",
    skipKeyValidation: true,
    columns: PROCESOS_PENALES_COLUMNS,
  },
};
`;

fs.writeFileSync(path.join(root, "src/infrastructure/export/excelConfig.js"), excelConfigOut, "utf8");
console.log("Wrote src/infrastructure/export/excelConfig.js");

const headerRules = fields
  .filter((f) => f.name !== "registro_id")
  .map((f) => ({ field: f.name, patterns: [f.label] }));

const headerMapOut = `import { MODULES } from "../../domain/modules.js";

export const HEADER_FIELD_RULES = {
  [MODULES.PROCESOS_PENALES]: ${JSON.stringify(headerRules, null, 2)},
};

export function normalizeHeader(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/\\r?\\n/g, " ")
    .replace(/\\s+/g, " ")
    .trim()
    .toUpperCase();
}

export function matchHeaderToField(moduleKey, headerText) {
  const normalized = normalizeHeader(headerText);
  if (!normalized || normalized === "#" || normalized === "ITEM") return null;

  const rules = HEADER_FIELD_RULES[moduleKey] || [];

  for (const rule of rules) {
    for (const pattern of rule.patterns) {
      const p = normalizeHeader(pattern);
      if (normalized === p || normalized.includes(p)) {
        return rule.field;
      }
    }
  }

  return null;
}

export function matchHeaderToFieldStrict(moduleKey, headerText, col, usedFields) {
  const field = matchHeaderToField(moduleKey, headerText);
  if (!field || usedFields.has(field)) return null;
  return field;
}
`;

fs.writeFileSync(path.join(root, "src/infrastructure/import/excelHeaderMap.js"), headerMapOut, "utf8");
console.log("Wrote src/infrastructure/import/excelHeaderMap.js");
console.log("Fields:", fields.length, "Catalog keys:", Object.keys(catalogsForModule).length);
