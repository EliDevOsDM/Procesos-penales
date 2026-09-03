import { useEffect, useState } from "react";
import { catalogUseCases, fieldConfigUseCases } from "../../di/container.js";
import { MODULE_LIST } from "../../domain/modules.js";
import { CATALOG_LABELS } from "../../domain/catalogs.js";
import {
  ALWAYS_REQUIRED,
  getConfigurableFields,
} from "../../domain/fieldConfig.js";

export default function CatalogsPage() {
  const [tab, setTab] = useState("listas");
  const moduleKey = MODULE_LIST[0].key;
  const [catalogs, setCatalogs] = useState({});
  const [requiredFields, setRequiredFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newItems, setNewItems] = useState({});

  const module = MODULE_LIST.find((m) => m.key === moduleKey);
  const configurableFields = module ? getConfigurableFields(module) : [];
  const alwaysRequired = ALWAYS_REQUIRED[moduleKey] ?? [];

  const load = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      if (tab === "listas") {
        setCatalogs(await catalogUseCases.getModuleCatalogs(moduleKey));
      } else {
        setRequiredFields(await fieldConfigUseCases.getRequiredFields(moduleKey));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [moduleKey, tab]);

  const labels = CATALOG_LABELS[moduleKey] || {};

  const addItem = async (listKey) => {
    const value = (newItems[listKey] || "").trim();
    if (!value) return;
    const current = catalogs[listKey] || [];
    if (current.includes(value)) {
      setError("Ese valor ya existe en la lista.");
      return;
    }
    setError("");
    const updated = await catalogUseCases.updateList(moduleKey, listKey, [
      ...current,
      value,
    ]);
    setCatalogs(updated);
    setNewItems({ ...newItems, [listKey]: "" });
  };

  const removeItem = async (listKey, value) => {
    if (!window.confirm(`¿Eliminar "${value}" de la lista?`)) return;
    const updated = await catalogUseCases.updateList(
      moduleKey,
      listKey,
      (catalogs[listKey] || []).filter((item) => item !== value)
    );
    setCatalogs(updated);
  };

  const toggleRequired = (fieldName) => {
    if (alwaysRequired.includes(fieldName)) return;
    setRequiredFields((prev) =>
      prev.includes(fieldName)
        ? prev.filter((name) => name !== fieldName)
        : [...prev, fieldName]
    );
  };

  const saveRequiredFields = async () => {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const saved = await fieldConfigUseCases.saveRequiredFields(
        moduleKey,
        requiredFields
      );
      setRequiredFields(saved);
      setSuccess("Campos obligatorios guardados.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page">
      <h2>Configuración del formulario</h2>
      <p className="page-subtitle">
        Administra listas desplegables y campos obligatorios .
      </p>

      {error && <div className="alert">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <div className="catalog-module-tabs">
        <button
          type="button"
          className={`btn ${tab === "listas" ? "primary" : ""}`}
          onClick={() => setTab("listas")}
        >
          Listas desplegables
        </button>
        <button
          type="button"
          className={`btn ${tab === "required" ? "primary" : ""}`}
          onClick={() => setTab("required")}
        >
          Campos obligatorios
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : tab === "listas" ? (
        Object.keys(catalogs).length === 0 ? (
          <div className="card">
            <p>No se pudieron cargar las listas. Recarga la página o revisa Firebase.</p>
          </div>
        ) : (
          <div className="catalog-grid">
            {Object.entries(catalogs).map(([listKey, items]) => (
              <div key={listKey} className="card catalog-card">
                <h3>{labels[listKey] || listKey}</h3>
                <ul className="catalog-list">
                  {(items || []).map((item) => (
                    <li key={item}>
                      <span>{item}</span>
                      <button
                        type="button"
                        className="btn small danger"
                        onClick={() => removeItem(listKey, item)}
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="catalog-add">
                  <input
                    type="text"
                    value={newItems[listKey] || ""}
                    placeholder="Nueva opción..."
                    onChange={(e) =>
                      setNewItems({ ...newItems, [listKey]: e.target.value })
                    }
                    onKeyDown={(e) => e.key === "Enter" && addItem(listKey)}
                  />
                  <button
                    type="button"
                    className="btn small primary"
                    onClick={() => addItem(listKey)}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="card required-fields-card">
          <p className="page-subtitle">
            Marca qué campos serán obligatorios al crear o editar registros en{" "}
            <strong>{module?.navLabel || module?.label}</strong>.
          </p>
          <ul className="required-fields-list">
            {configurableFields.map((field) => {
              const locked = alwaysRequired.includes(field.name);
              const checked = locked || requiredFields.includes(field.name);
              return (
                <li key={field.name}>
                  <label>
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={locked}
                      onChange={() => toggleRequired(field.name)}
                    />
                    <span>{field.label}</span>
                    {locked && <span className="field-tag">Siempre obligatorio</span>}
                  </label>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="btn primary"
            onClick={saveRequiredFields}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar campos obligatorios"}
          </button>
        </div>
      )}
    </div>
  );
}
