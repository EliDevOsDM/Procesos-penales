export const HEARING_DATE_FIELDS = [
  {
    field: "fecha_audiencia_de_acusacion",
    label: "Audiencia de acusación",
    shortLabel: "Acusación",
    className: "event-acusacion",
  },
  {
    field: "fecha_de_audiencia_preparatoria",
    label: "Audiencia preparatoria",
    shortLabel: "Preparatoria",
    className: "event-preparatoria",
  },
  {
    field: "fecha_de_audiencia_de_juicio",
    label: "Audiencia de juicio oral",
    shortLabel: "Juicio oral",
    className: "event-juicio",
  },
];

export function toDateKey(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
}

export function extractHearingEvents(records) {
  const events = [];

  for (const record of records) {
    for (const cfg of HEARING_DATE_FIELDS) {
      const date = toDateKey(record[cfg.field]);
      if (!date) continue;

      events.push({
        id: `${record.id}-${cfg.field}`,
        recordId: record.id,
        date,
        type: cfg.field,
        label: cfg.label,
        shortLabel: cfg.shortLabel,
        className: cfg.className,
        procesados: record.procesados || "—",
        causa: record.causa || "",
        registroId: record.registro_id,
        radicado: record.radicado || record.numero_de_radicado_men_entrada || "",
      });
    }
  }

  return events.sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate !== 0) return byDate;
    return String(a.procesados).localeCompare(String(b.procesados), "es");
  });
}

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function formatMonthYear(year, month) {
  return `${MONTH_NAMES[month]} ${year}`;
}

export function todayDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function dateKeyFromParts(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/** Genera celdas del mes (Lunes = inicio de semana). */
export function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const cells = [];
  const prevMonthDays = new Date(year, month, 0).getDate();

  for (let i = startOffset - 1; i >= 0; i -= 1) {
    const day = prevMonthDays - i;
    const m = month === 0 ? 11 : month - 1;
    const y = month === 0 ? year - 1 : year;
    const date = dateKeyFromParts(y, m, day);
    const dow = new Date(y, m, day).getDay();
    cells.push({
      date,
      day,
      inMonth: false,
      isWeekend: dow === 0 || dow === 6,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = dateKeyFromParts(year, month, day);
    const dow = new Date(year, month, day).getDay();
    cells.push({
      date,
      day,
      inMonth: true,
      isWeekend: dow === 0 || dow === 6,
    });
  }

  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    const m = month === 11 ? 0 : month + 1;
    const y = month === 11 ? year + 1 : year;
    const date = dateKeyFromParts(y, m, nextDay);
    const dow = new Date(y, m, nextDay).getDay();
    cells.push({
      date,
      day: nextDay,
      inMonth: false,
      isWeekend: dow === 0 || dow === 6,
    });
    nextDay += 1;
  }

  return cells;
}

export function formatDisplayDate(dateKey) {
  if (!dateKey) return "—";
  const [y, m, d] = dateKey.split("-");
  return `${d}/${m}/${y}`;
}
