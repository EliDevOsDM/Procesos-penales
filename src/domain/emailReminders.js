export const REMINDER_MODULES = [
  {
    key: "procesos_penales",
    collection: "procesos_penales",
    label: "Procesos Penales",
    estadoField: "estado_del_proceso",
    procesoField: "radicado",
    closedStates: ["TERMINADO"],
  },
];

export const todayISO = () => new Date().toISOString().slice(0, 10);

export function isClosedRecord(record, module) {
  const estado = record[module.estadoField];
  return Boolean(estado && module.closedStates.includes(estado));
}

/** Envía alerta cuando se alcanza una fecha de audiencia programada. */
export function shouldSendAlert(record, today = todayISO()) {
  const alertFields = [
    "fecha_audiencia_de_acusacion",
    "fecha_de_audiencia_preparatoria",
    "fecha_de_audiencia_de_juicio",
  ];

  for (const field of alertFields) {
    const fecha = String(record[field] ?? "").slice(0, 10);
    if (fecha && fecha <= today) {
      const sentKey = `alerta_${field}`;
      if (record.notificaciones?.[sentKey] === fecha) continue;
      return true;
    }
  }

  return false;
}

export function alertSubject(record, module) {
  const id = record.registro_id ?? record.radicado ?? record.id;
  return `[Procesos Penales] Recordatorio — registro ${id}`;
}

export function alertBody(record, module) {
  const id = record.registro_id ?? record.radicado ?? "—";
  const procesado = record.procesados ?? "—";
  const etapa = record.etapa_procesal_actual ?? "—";
  return (
    `Registro ${id}\n` +
    `Procesado(s): ${procesado}\n` +
    `Etapa procesal: ${etapa}\n\n` +
    `Revise las fechas de audiencia en el panel Procesos Penales.`
  );
}
