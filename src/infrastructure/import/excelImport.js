import * as XLSX from "xlsx";
import { EXCEL_MODULE_CONFIG } from "../export/excelConfig.js";
import {
  normalizeHeader,
  matchHeaderToFieldStrict,
} from "./excelHeaderMap.js";

const getCellRaw = (sheet, row, col) => {
  const cell = sheet[XLSX.utils.encode_cell({ r: row, c: col })];
  if (!cell) return null;
  return cell.v;
};

export function parseExcelDate(value) {
  if (value == null || value === "") return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "number") {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (parsed) {
      const m = String(parsed.m).padStart(2, "0");
      const d = String(parsed.d).padStart(2, "0");
      return `${parsed.y}-${m}-${d}`;
    }
  }
  const str = String(value).trim();
  if (!str) return null;

  const dmy = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (dmy) {
    return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(str)) return str.slice(0, 10);
  return str;
}

function parseCurrency(value) {
  if (value == null || value === "") return null;
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  const n = Number(String(value).replace(/[^\d.,-]/g, "").replace(",", "."));
  return Number.isNaN(n) ? null : n;
}

function buildFieldTypes(config) {
  const types = {};
  for (const col of config.columns || []) {
    if (col.type) types[col.field] = col.type;
  }
  return types;
}

function parseCellValue(field, raw, fieldTypes) {
  if (raw == null || raw === "") return null;
  const type = fieldTypes[field];
  if (type === "date") return parseExcelDate(raw);
  if (type === "currency") return parseCurrency(raw);
  if (field === "registro_id") {
    const n = Number(String(raw).replace(/\D/g, ""));
    return Number.isNaN(n) ? null : n;
  }
  return String(raw).trim() || null;
}

function findSheet(workbook, names) {
  for (const name of names) {
    if (workbook.Sheets[name]) return { sheet: workbook.Sheets[name], name };
  }
  for (const name of workbook.SheetNames) {
    const upper = name.toUpperCase();
    if (names.some((n) => n.toUpperCase() === upper)) {
      return { sheet: workbook.Sheets[name], name };
    }
  }
  const first = workbook.SheetNames[0];
  return first ? { sheet: workbook.Sheets[first], name: first } : { sheet: null, name: null };
}

function detectLayout(sheet, moduleKey, keyField) {
  const range = sheet["!ref"] ? XLSX.utils.decode_range(sheet["!ref"]) : null;
  if (!range) return null;

  let best = null;

  for (let row = range.s.r; row <= Math.min(range.e.r, 25); row++) {
    const columnMap = {};
    const usedFields = new Set();

    for (let col = range.s.c; col <= range.e.c; col++) {
      const raw = getCellRaw(sheet, row, col);
      if (raw == null || String(raw).trim() === "") continue;

      const field = matchHeaderToFieldStrict(moduleKey, raw, col, usedFields);
      if (field) {
        columnMap[field] = col;
        usedFields.add(field);
      }
    }

    const matchCount = Object.keys(columnMap).length;
    if (!columnMap[keyField] && !configHasFlexibleKey(moduleKey)) continue;

    if (!best || matchCount > best.matchCount) {
      best = {
        headerRow: row,
        dataStartRow: row + 1,
        columnMap,
        matchCount,
      };
    }
  }

  return best;
}

function configHasFlexibleKey(moduleKey) {
  return Boolean(EXCEL_MODULE_CONFIG[moduleKey]?.skipKeyValidation);
}

function buildFixedLayout(config) {
  const columnMap = {};
  for (const col of config.columns) {
    if (col.field === "__item__") continue;
    columnMap[col.field] = col.col;
  }
  return {
    headerRow: config.headerRow ?? config.dataStartRow - 1,
    dataStartRow: config.dataStartRow,
    columnMap,
    matchCount: Object.keys(columnMap).length,
  };
}

function resolveLayout(sheet, moduleKey, config) {
  const detected = detectLayout(sheet, moduleKey, config.keyField);
  if (detected && detected.matchCount >= 5) {
    if (config.skipKeyValidation && config.dataStartRow > detected.dataStartRow) {
      return { ...detected, dataStartRow: config.dataStartRow };
    }
    return detected;
  }
  return buildFixedLayout(config);
}

function rowHasData(sheet, row, columnMap, keyField, skipKeyValidation) {
  if (!skipKeyValidation) {
    const keyCol = columnMap[keyField];
    if (keyCol != null) {
      const keyVal = getCellRaw(sheet, row, keyCol);
      if (keyVal != null && String(keyVal).trim() !== "") return true;
    }
  }
  return Object.values(columnMap).some((col) => {
    const v = getCellRaw(sheet, row, col);
    return v != null && String(v).trim() !== "";
  });
}

function parseRow(sheet, row, columnMap, config, fieldTypes) {
  const record = { actuaciones: [], referencia: null };

  for (const [field, col] of Object.entries(columnMap)) {
    record[field] = parseCellValue(field, getCellRaw(sheet, row, col), fieldTypes);
  }

  const resumen = record.resumen_de_actuacion_anterior;
  if (resumen && typeof resumen === "string") {
    record.actuaciones = [{ fecha: null, actuacion: resumen }];
    delete record.resumen_de_actuacion_anterior;
  }

  if (record[config.keyField] != null && !config.skipKeyValidation) {
    record[config.keyField] = String(record[config.keyField]).replace(/\D/g, "").slice(0, 23);
  }

  return record;
}

function isHintRow(rawKeyValue) {
  const upper = normalizeHeader(String(rawKeyValue ?? ""));
  return (
    upper.includes("NUMERICO") ||
    upper.includes("CAMPO ") ||
    upper.includes("RECUERDA") ||
    upper.includes("DEBE SER") ||
    upper.includes("ES NUMERICO") ||
    upper.includes("ID NUMERICO")
  );
}

function isImportableRow(record, config, rawKeyValue) {
  if (isHintRow(rawKeyValue)) return false;

  if (config.skipKeyValidation) {
    const hasMeaningfulData = Object.entries(record).some(([key, value]) => {
      if (key === "actuaciones" || key === "referencia") return false;
      return value != null && String(value).trim() !== "";
    });
    return hasMeaningfulData;
  }

  const keyStr = String(rawKeyValue ?? record[config.keyField] ?? "").trim();
  if (!keyStr) return false;
  const digits = keyStr.replace(/\D/g, "");
  return digits.length >= 20;
}

export function parseModuleExcel(moduleKey, arrayBuffer) {
  const config = EXCEL_MODULE_CONFIG[moduleKey];
  if (!config) {
    throw new Error("Este módulo no admite importación Excel.");
  }

  const fieldTypes = buildFieldTypes(config);
  const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
  const { sheet, name: sheetName } = findSheet(workbook, config.sheetNames);

  if (!sheet) {
    throw new Error(
      `No se encontró la hoja de datos. Esperada: ${config.sheetNames.join(" o ")}.`
    );
  }

  const layout = resolveLayout(sheet, moduleKey, config);

  const rows = [];
  let emptyStreak = 0;
  const range = sheet["!ref"] ? XLSX.utils.decode_range(sheet["!ref"]) : null;
  const maxRow = range ? range.e.r : 500;

  for (let row = layout.dataStartRow; row <= maxRow; row++) {
    if (!rowHasData(sheet, row, layout.columnMap, config.keyField, config.skipKeyValidation)) {
      emptyStreak += 1;
      if (emptyStreak >= 5) break;
      continue;
    }
    emptyStreak = 0;

    const keyCol = layout.columnMap[config.keyField];
    const rawKey = keyCol != null ? getCellRaw(sheet, row, keyCol) : null;
    const data = parseRow(sheet, row, layout.columnMap, config, fieldTypes);

    if (!isImportableRow(data, config, rawKey)) continue;

    rows.push({
      excelRow: row + 1,
      data,
      sheetName,
    });
  }

  if (rows.length === 0) {
    throw new Error(
      `No se encontraron filas con datos en "${sheetName}". Verifica el formato del Excel.`
    );
  }

  return rows;
}
