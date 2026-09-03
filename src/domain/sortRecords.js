/** Hacer: fecha ejecutoria más reciente primero; sin fecha al final. */
export function sortCumplimientoItems(items) {
  return [...items].sort((a, b) => {
    const da = String(a.fecha_ejecutoria || "").slice(0, 10);
    const db = String(b.fecha_ejecutoria || "").slice(0, 10);

    if (da !== db) {
      if (!da) return 1;
      if (!db) return -1;
      return db.localeCompare(da);
    }

    const pa = String(a.proceso || "").replace(/\D/g, "");
    const pb = String(b.proceso || "").replace(/\D/g, "");
    return pb.localeCompare(pa, undefined, { numeric: true });
  });
}
