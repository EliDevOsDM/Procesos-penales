import * as XLSX from "xlsx";
import { EXCEL_MODULE_CONFIG } from "./excelConfig.js";

/** Límite de caracteres por celda en Excel (.xlsx). */
const EXCEL_MAX_CELL_LENGTH = 32767;

const clampExcelText = (value) => {
  const str = String(value);
  if (str.length <= EXCEL_MAX_CELL_LENGTH) return str;
  return `${str.slice(0, EXCEL_MAX_CELL_LENGTH - 1)}…`;
};

const formatExcelDate = (value) => {
  if (!value) return "";
  const str = String(value).slice(0, 10);
  const [y, m, d] = str.split("-");
  if (d && m && y) return `${d}/${m}/${y}`;
  return str;
};

const formatExcelValue = (colDef, value, rowIndex) => {
  if (colDef.field === "__item__") return rowIndex + 1;
  if (value === null || value === undefined || value === "") return "";
  if (colDef.type === "date") return formatExcelDate(value);
  if (colDef.type === "currency") return Number(value);
  return clampExcelText(value);
};

const formatActuacionDate = (value) => {
  if (!value) return "";
  return formatExcelDate(value);
};

function buildMainSheet(items, config) {
  const { columns, headerRow, dataStartRow } = config;
  const sheet = {};

  columns.forEach(({ col, header }) => {
    sheet[XLSX.utils.encode_cell({ r: headerRow, c: col })] = { t: "s", v: header };
  });

  items.forEach((item, index) => {
    const row = dataStartRow + index;
    columns.forEach((colDef) => {
      const value = formatExcelValue(colDef, item[colDef.field], index);
      if (value === "" || value === null || value === undefined) return;
      const ref = XLSX.utils.encode_cell({ r: row, c: colDef.col });
      const type = typeof value === "number" ? "n" : "s";
      sheet[ref] = { t: type, v: value };
    });
  });

  const maxCol = Math.max(...columns.map((c) => c.col));
  const maxRow = items.length > 0 ? dataStartRow + items.length - 1 : headerRow;
  sheet["!ref"] = XLSX.utils.encode_range({
    s: { r: headerRow, c: 0 },
    e: { r: maxRow, c: maxCol },
  });

  return sheet;
}

function buildActuacionesSheet(items, config) {
  const { keyField, keyHeader } = config;
  const headers = [keyHeader, "FECHA", "ACTUACIÓN"];
  const sheet = {};

  headers.forEach((header, col) => {
    sheet[XLSX.utils.encode_cell({ r: 0, c: col })] = { t: "s", v: header };
  });

  let row = 1;
  for (const item of items) {
    const proceso = String(item[keyField] ?? "").replace(/\D/g, "").slice(0, 23);
    if (!proceso) continue;

    for (const act of item.actuaciones || []) {
      if (!act?.actuacion?.trim()) continue;
      sheet[XLSX.utils.encode_cell({ r: row, c: 0 })] = { t: "s", v: proceso };
      sheet[XLSX.utils.encode_cell({ r: row, c: 1 })] = {
        t: "s",
        v: formatActuacionDate(act.fecha),
      };
      sheet[XLSX.utils.encode_cell({ r: row, c: 2 })] = {
        t: "s",
        v: clampExcelText(String(act.actuacion).trim()),
      };
      row += 1;
    }
  }

  sheet["!ref"] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: Math.max(row - 1, 0), c: 2 },
  });

  return sheet;
}

export async function exportModuleToExcel(module, items) {
  const config = EXCEL_MODULE_CONFIG[module.key];
  if (!config) {
    throw new Error("Este módulo no tiene exportación Excel.");
  }

  const sortedItems = items;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    buildMainSheet(sortedItems, config),
    config.mainSheetName
  );
  XLSX.utils.book_append_sheet(
    workbook,
    buildActuacionesSheet(sortedItems, config),
    config.actuacionesSheetName
  );

  XLSX.writeFile(workbook, config.fileName);
}
