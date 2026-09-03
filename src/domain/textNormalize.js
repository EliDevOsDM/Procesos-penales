/** Mayúsculas mientras escribe (no quita espacios al final). */
export function toUpperTextInput(value) {
  if (value == null || value === "") return value;
  return String(value).toUpperCase();
}

/** Mayúsculas al guardar (recorta espacios sobrantes). */
export function toUpperText(value) {
  if (value == null || value === "") return value;
  return String(value).trim().toUpperCase();
}

export function shouldUppercaseField(field) {
  if (!field) return false;
  if (field.type === "email") return false;
  if (field.type === "date") return false;
  if (field.type === "currency") return false;
  if (field.type === "number") return false;
  if (field.autoId) return false;
  if (field.validate23) return false;
  return true;
}

/** Normaliza texto para búsquedas (sin tildes, minúsculas). */
export function normalizeSearchText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Comprueba si un token coincide con una palabra completa (igual o prefijo). */
function wordMatchesToken(word, token) {
  return word === token || word.startsWith(token);
}

/**
 * Coincide si el query aparece en el texto buscando solo palabras completas.
 * - Una palabra: cualquier palabra del texto que coincida (ej. "henry" → "HENRY MARTIN").
 * - Varias palabras: deben aparecer seguidas en el mismo orden (ej. "henry ma" → "HENRY MARTIN").
 * No usa substring dentro de otras palabras (evita "ola" dentro de "colaboracion").
 */
export function matchesSearchQuery(haystack, query) {
  const normalizedHaystack = normalizeSearchText(haystack);
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const tokens = normalizedQuery.split(" ").filter(Boolean);
  const words = normalizedHaystack.split(/\s+/).filter(Boolean);
  if (words.length === 0) return false;

  if (tokens.length === 1) {
    const token = tokens[0];
    return words.some((word) => wordMatchesToken(word, token));
  }

  for (let i = 0; i <= words.length - tokens.length; i += 1) {
    let allMatch = true;
    for (let j = 0; j < tokens.length; j += 1) {
      if (!wordMatchesToken(words[i + j], tokens[j])) {
        allMatch = false;
        break;
      }
    }
    if (allMatch) return true;
  }

  return false;
}
