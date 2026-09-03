import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { calendarUseCases } from "../../di/container.js";
import {
  buildMonthGrid,
  formatDisplayDate,
  formatMonthYear,
  todayDateKey,
} from "../../domain/calendarEvents.js";

const WEEKDAYS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

export default function CalendarPage() {
  const { role } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [selectedDate, setSelectedDate] = useState(todayDateKey());

  useEffect(() => {
    setLoading(true);
    setError("");
    calendarUseCases
      .getHearings(role)
      .then(setEvents)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [role]);

  const eventsByDate = useMemo(() => {
    const map = new Map();
    for (const event of events) {
      if (!map.has(event.date)) map.set(event.date, []);
      map.get(event.date).push(event);
    }
    return map;
  }, [events]);

  const monthCells = useMemo(
    () => buildMonthGrid(cursor.year, cursor.month),
    [cursor.year, cursor.month]
  );

  const monthDateKeys = useMemo(
    () => new Set(monthCells.filter((c) => c.inMonth).map((c) => c.date)),
    [monthCells]
  );

  const selectedEvents = eventsByDate.get(selectedDate) || [];

  const upcomingInMonth = useMemo(() => {
    const today = todayDateKey();
    return events
      .filter((e) => monthDateKeys.has(e.date) && e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 12);
  }, [events, monthDateKeys]);

  const goToday = () => {
    const now = new Date();
    setCursor({ year: now.getFullYear(), month: now.getMonth() });
    setSelectedDate(todayDateKey());
  };

  const shiftMonth = (delta) => {
    setCursor((prev) => {
      const d = new Date(prev.year, prev.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  return (
    <div className="page calendar-page">
      <div className="page-header-row">
        <div>
          <h2>Calendario de audiencias</h2>
          <p className="page-subtitle">
            Fechas de acusación, preparatoria y juicio oral de los procesos
          </p>
        </div>
        <div className="calendar-nav">
          <button type="button" className="btn" onClick={() => shiftMonth(-1)} aria-label="Mes anterior">
            ‹
          </button>
          <button type="button" className="btn" onClick={goToday}>
            Hoy
          </button>
          <button type="button" className="btn" onClick={() => shiftMonth(1)} aria-label="Mes siguiente">
            ›
          </button>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <p>Cargando calendario...</p>
      ) : (
        <div className="calendar-layout">
          <div className="calendar-main card">
            <h3 className="calendar-month-title">{formatMonthYear(cursor.year, cursor.month)}</h3>

            <div className="calendar-weekdays">
              {WEEKDAYS.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="calendar-grid">
              {monthCells.map((cell) => {
                const dayEvents = eventsByDate.get(cell.date) || [];
                const isSelected = cell.date === selectedDate;
                const isToday = cell.date === todayDateKey();

                return (
                  <button
                    key={cell.date}
                    type="button"
                    className={[
                      "calendar-cell",
                      !cell.inMonth && "other-month",
                      cell.isWeekend && "weekend",
                      isSelected && "selected",
                      isToday && "today",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => setSelectedDate(cell.date)}
                  >
                    <span className="calendar-day-num">{cell.day}</span>
                    <div className="calendar-day-events">
                      {dayEvents.slice(0, 3).map((event) => (
                        <span
                          key={event.id}
                          className={`calendar-event-dot ${event.className}`}
                          title={`${event.shortLabel}: ${event.procesados}`}
                        >
                          {event.shortLabel}
                        </span>
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="calendar-more">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="calendar-legend">
              <span className="legend-item event-acusacion">Acusación</span>
              <span className="legend-item event-preparatoria">Preparatoria</span>
              <span className="legend-item event-juicio">Juicio oral</span>
            </div>
          </div>

          <aside className="calendar-sidebar card">
            <section className="calendar-sidebar-section">
              <h4>
                {selectedDate === todayDateKey() ? "Hoy" : formatDisplayDate(selectedDate)}
              </h4>
              {selectedEvents.length === 0 ? (
                <p className="muted-text">Sin audiencias este día.</p>
              ) : (
                <ul className="calendar-event-list">
                  {selectedEvents.map((event) => (
                    <li key={event.id} className={`calendar-event-card ${event.className}`}>
                      <strong>{event.shortLabel}</strong>
                      <span>{event.procesados}</span>
                      {event.causa && <small>{event.causa}</small>}
                      <Link to={`/procesos-penales?ver=${event.recordId}`} className="calendar-event-link">
                        Ver proceso
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="calendar-sidebar-section">
              <h4>Próximas en el mes</h4>
              {upcomingInMonth.length === 0 ? (
                <p className="muted-text">No hay más audiencias este mes.</p>
              ) : (
                <ul className="calendar-event-list compact">
                  {upcomingInMonth.map((event) => (
                    <li key={event.id} className="calendar-upcoming-item">
                      <button
                        type="button"
                        className="calendar-upcoming-btn"
                        onClick={() => setSelectedDate(event.date)}
                      >
                        <span className="calendar-upcoming-date">{formatDisplayDate(event.date)}</span>
                        <span className={`calendar-upcoming-type ${event.className}`}>
                          {event.shortLabel}
                        </span>
                        <span className="calendar-upcoming-name">{event.procesados}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}
