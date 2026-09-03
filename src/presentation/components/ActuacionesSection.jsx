import { emptyActuacion } from "../../domain/recordExtras.js";
import { toUpperTextInput } from "../../domain/textNormalize.js";

const formatDisplayDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

export default function ActuacionesSection({ actuaciones, onChange, readOnly = false }) {
  const updateRow = (index, patch) => {
    const next = actuaciones.map((row, i) =>
      i === index ? { ...row, ...patch } : row
    );
    onChange(next);
  };

  const addRow = () => onChange([...actuaciones, emptyActuacion()]);

  const removeRow = (index) => {
    onChange(actuaciones.filter((_, i) => i !== index));
  };

  return (
    <div className="form-section">
      <h4 className="form-section-title">ACTUACIONES</h4>
      <p className="form-section-subtitle">Actuaciones</p>

      {actuaciones.length === 0 && (
        <p className="muted-text">No hay actuaciones registradas.</p>
      )}

      <div className="actuaciones-list">
        {actuaciones.map((row, index) => (
          <div key={index} className="actuacion-row">
            <label>
              Fecha
              <input
                type="date"
                value={row.fecha || ""}
                disabled={readOnly}
                onChange={(e) => updateRow(index, { fecha: e.target.value })}
              />
              <span className="field-hint">{formatDisplayDate(row.fecha)}</span>
            </label>
            <label className="actuacion-text">
              Actuacion
              <textarea
                rows={3}
                value={row.actuacion}
                disabled={readOnly}
                onChange={(e) =>
                  updateRow(index, { actuacion: toUpperTextInput(e.target.value) })
                }
                placeholder="Describa la actuación..."
              />
            </label>
            {!readOnly && (
            <button
              type="button"
              className="btn icon danger"
              onClick={() => removeRow(index)}
              aria-label="Eliminar actuación"
            >
              ×
            </button>
            )}
          </div>
        ))}
      </div>

      {!readOnly && (
      <button type="button" className="btn primary outline" onClick={addRow}>
        + Actuacion
      </button>
      )}
    </div>
  );
}
