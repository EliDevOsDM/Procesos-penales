/** Solo dígitos del valor (para guardar en formulario). */
export function parseCOPDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

/** Formato colombiano con puntos: 100000 → 100.000 */
export function formatCOPThousands(value) {
  const digits = parseCOPDigits(value);
  if (!digits) return "";
  return Number(digits).toLocaleString("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/** Formato con símbolo: $ 100.000.000 */
export function formatCOP(value) {
  const formatted = formatCOPThousands(value);
  return formatted ? `$ ${formatted}` : "$ 0";
}

/** Convierte texto con puntos a número para Firestore. */
export function parseCOPNumber(value) {
  const digits = parseCOPDigits(value);
  if (!digits) return null;
  return Number(digits);
}
