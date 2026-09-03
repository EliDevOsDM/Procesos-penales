// Reglas de fechas del Excel (mismas que en server/helpers.js)
export function addMonths(dateStr, months) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

export function addDays(dateStr, days) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function validacionOportunidad(fechaTraslado, fechaMaxima) {
  if (!fechaTraslado || !fechaMaxima) return "";
  return fechaTraslado <= fechaMaxima ? "A TIEMPO" : "EXTEMPORANEO";
}

export function computeSeguimientoFields(form) {
  const out = { ...form };
  if (out.fecha_ejecutoria) {
    out.fecha_alerta_maxima = addMonths(out.fecha_ejecutoria, 9);
    out.fecha_maxima_cumplimiento = addMonths(out.fecha_ejecutoria, 10);
  }
  out.validacion_oportunidad = validacionOportunidad(
    out.fecha_traslado_cumplimiento,
    out.fecha_maxima_cumplimiento
  );
  return out;
}

export function computeCumplimientoFields(form) {
  const out = { ...form };
  if (out.fecha_ejecutoria) {
    out.fecha_alerta_maxima = addDays(out.fecha_ejecutoria, 20);
    out.fecha_maxima_cumplimiento = addDays(out.fecha_ejecutoria, 30);
  }
  out.validacion_oportunidad = validacionOportunidad(
    out.fecha_traslado_cumplimiento,
    out.fecha_maxima_cumplimiento
  );
  return out;
}

export function validateProceso23(value, label = "Número de proceso") {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (digits.length !== 23) {
    throw new Error(`${label}: debe tener exactamente 23 dígitos.`);
  }
  return digits;
}
