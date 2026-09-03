import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { crudUseCasesByModule, storageService } from "../../di/container.js";
import { useAuth } from "../context/AuthContext.jsx";
import { isFieldRequired } from "../../domain/fieldConfig.js";
import { exportModuleToExcel } from "../../infrastructure/export/excelExport.js";
import { parseModuleExcel } from "../../infrastructure/import/excelImport.js";
import { formatCOP, formatCOPThousands, parseCOPDigits } from "../../domain/currency.js";
import { buildRecordPayload } from "../../domain/recordExtras.js";
import { toUpperTextInput, shouldUppercaseField, matchesSearchQuery } from "../../domain/textNormalize.js";
import ActuacionesSection from "../components/ActuacionesSection.jsx";
import ReferenciaPdfSection from "../components/ReferenciaPdfSection.jsx";
import SharePointFolderLink from "../components/SharePointFolderLink.jsx";

const buildEmptyForm = (module) =>
  Object.fromEntries(module.fields.map((f) => [f.name, ""]));

const formatDate = (value) => {
  if (!value) return "—";
  const str = String(value).slice(0, 10);
  const [y, m, d] = str.split("-");
  return d && m && y ? `${d}/${m}/${y}` : str;
};

export default function CrudPage({ module }) {
  const { role, canWrite } = useAuth();
  const useCases = crudUseCasesByModule[module.key];
  const canModify = canWrite(module.key);

  const [items, setItems] = useState([]);
  const [catalogs, setCatalogs] = useState({});
  const [form, setForm] = useState(buildEmptyForm(module));
  const [actuaciones, setActuaciones] = useState([]);
  const [referencia, setReferencia] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [requiredFields, setRequiredFields] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const openedFromQuery = useRef(false);

  const tableFields = module.fields.filter((f) => f.table);
  const estadoField = module.estadoField || "estado_del_proceso";
  const estadoCatalogKey = module.estadoCatalogKey || estadoField;
  const formFields = module.fields.filter((f) => !f.autoId || editingId);

  const formFieldSections = useMemo(() => {
    const splitAudienciasSection = (fields) => {
      const startIdx = fields.findIndex((f) => f.name === "audiencia_de_acusacion_si_no");
      const endIdx = fields.findIndex((f) => f.name === "fecha_sentencia_de_primera_instancia");
      if (startIdx < 0 || endIdx < startIdx) {
        return { before: fields, audiencias: [], after: [] };
      }
      return {
        before: fields.slice(0, startIdx),
        audiencias: fields.slice(startIdx, endIdx + 1),
        after: fields.slice(endIdx + 1),
      };
    };

    const peticionarioIdx = formFields.findIndex((f) => f.name === "peticionario");
    const identificacionIdx = formFields.findIndex(
      (f) => f.name === "identificacion_del_procesados"
    );

    if (peticionarioIdx < 0 || identificacionIdx < 0) {
      const audienciasSplit = splitAudienciasSection(formFields);
      return {
        datosProcesoBefore: audienciasSplit.before,
        abogadoExternoFields: [],
        datosProcesoMiddle: [],
        audienciasFields: audienciasSplit.audiencias,
        datosProcesoAfter: audienciasSplit.after,
      };
    }

    const audienciasSplit = splitAudienciasSection(formFields.slice(identificacionIdx));

    return {
      datosProcesoBefore: formFields.slice(0, peticionarioIdx),
      abogadoExternoFields: formFields.slice(peticionarioIdx, identificacionIdx),
      datosProcesoMiddle: audienciasSplit.before,
      audienciasFields: audienciasSplit.audiencias,
      datosProcesoAfter: audienciasSplit.after,
    };
  }, [formFields]);

  const resetFormState = () => {
    setForm(buildEmptyForm(module));
    setActuaciones([]);
    setReferencia(null);
    setPdfFile(null);
    setEditingId(null);
    setViewOnly(false);
    setShowForm(false);
  };

  const openNewForm = () => {
    if (!canModify) return;
    setForm(buildEmptyForm(module));
    setActuaciones([]);
    setReferencia(null);
    setPdfFile(null);
    setEditingId(null);
    setViewOnly(false);
    setShowForm(true);
  };

  const load = useCallback(async () => {
    setError("");
    try {
      setItems(await useCases.list(role));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [role, useCases]);

  useEffect(() => {
    resetFormState();
    setLoading(true);
    openedFromQuery.current = false;
    load();
    useCases.getCatalogs().then(setCatalogs).catch(() => setCatalogs({}));
    useCases.getRequiredFields().then(setRequiredFields).catch(() => setRequiredFields([]));
  }, [module.key, load, useCases]);

  const formatValue = (field, value) => {
    if (value === undefined || value === null || value === "") return "—";
    if (field.type === "currency") return formatCOP(value);
    if (field.type === "date") return formatDate(value);
    if (field.type === "textarea") {
      const s = String(value);
      return s.length > 60 ? s.slice(0, 60) + "…" : s;
    }
    return String(value);
  };

  const buildSearchHaystack = (item) =>
    tableFields
      .map((f) => item[f.name])
      .filter(Boolean)
      .join(" ");

  const filteredItems = useMemo(() => {
    const q = filterText.trim();
    return items.filter((item) => {
      if (filterEstado && item[estadoField] !== filterEstado) return false;
      if (!q) return true;
      return matchesSearchQuery(buildSearchHaystack(item), q);
    });
  }, [items, filterText, filterEstado, estadoField, tableFields]);

  const updateForm = (patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
  };

  const handleFieldChange = (field, rawValue) => {
    const value = shouldUppercaseField(field) ? toUpperTextInput(rawValue) : rawValue;
    updateForm({ [field.name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      let referenciaData = referencia;
      if (pdfFile) {
        const docId = editingId || `tmp_${Date.now()}`;
        referenciaData = await storageService.uploadPdf(
          pdfFile,
          `${module.collection}/${docId}/referencia.pdf`
        );
      }

      const payload = buildRecordPayload(form, module, {
        actuaciones,
        referencia: referenciaData,
      });

      if (editingId) {
        await useCases.update(role, editingId, payload);
      } else {
        await useCases.create(role, payload);
      }
      resetFormState();
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (item, readOnly = false) => {
    setEditingId(item.id);
    setViewOnly(readOnly);
    setShowForm(true);
    setForm(
      Object.fromEntries(
        module.fields.map((f) => {
          let val = item[f.name];
          if (f.type === "date" && val) val = String(val).slice(0, 10);
          if (f.type === "currency" && val != null && val !== "") {
            val = parseCOPDigits(val);
          }
          return [f.name, val ?? ""];
        })
      )
    );
    setActuaciones(item.actuaciones || []);
    setReferencia(item.referencia || null);
    setPdfFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const verId = searchParams.get("ver");
    if (!verId || loading || openedFromQuery.current) return;
    const item = items.find((i) => i.id === verId);
    if (!item) return;
    openedFromQuery.current = true;
    handleEdit(item, true);
    setSearchParams({}, { replace: true });
  }, [items, loading, searchParams, setSearchParams]);

  const handleRemovePdf = async () => {
    if (referencia?.path) {
      try {
        await storageService.remove(referencia.path);
      } catch {
        /* ignorar si ya no existe */
      }
    }
    setReferencia(null);
    setPdfFile(null);
  };

  const handleExport = async () => {
    setError("");
    setExporting(true);
    try {
      await exportModuleToExcel(module, items);
    } catch (err) {
      setError(err.message);
    } finally {
      setExporting(false);
    }
  };

  const handleImportClick = () => {
    setImportResult(null);
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError("");
    setImportResult(null);

    try {
      const rows = parseModuleExcel(module.key, await file.arrayBuffer());
      const label = module.excelName || module.crudName;
      if (
        !window.confirm(
          `Se importarán ${rows.length} registro(s) desde "${file.name}" (${label}). ¿Continuar?`
        )
      ) {
        return;
      }

      setImporting(true);
      const result = await useCases.importRows(role, rows);
      setImportResult(result);
      await load();

      if (result.errors.length > 0) {
        setError(
          `Importación parcial: ${result.created} creado(s), ${result.errors.length} fila(s) con error.`
        );
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  const handleDelete = async (item) => {
    const label =
      item[module.fields.find((f) => f.table)?.name] ||
      item[module.fields[0].name] ||
      `#${item.id}`;
    if (!window.confirm(`¿Eliminar el registro "${label}"?`)) return;
    setError("");
    try {
      if (item.referencia?.path) {
        try {
          await storageService.remove(item.referencia.path);
        } catch {
          /* ignorar */
        }
      }
      await useCases.remove(role, item.id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderField = (field) => {
    const fieldRequired = isFieldRequired(field.name, requiredFields, module.key);
    const isDisabled = field.readOnly || viewOnly;
    const common = {
      id: field.name,
      value: form[field.name] ?? "",
      disabled: isDisabled,
      required: fieldRequired && !isDisabled,
    };

    if (field.type === "select") {
      const options = catalogs[field.catalogKey] || [];
      return (
        <select
          {...common}
          onChange={(e) => handleFieldChange(field, e.target.value)}
        >
          <option value="">Seleccionar</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          {...common}
          rows={3}
          onChange={(e) => handleFieldChange(field, e.target.value)}
        />
      );
    }

    if (field.type === "date") {
      return (
        <input
          type="date"
          {...common}
          onChange={(e) => handleFieldChange(field, e.target.value)}
        />
      );
    }

    if (field.validate23) {
      return (
        <input
          type="text"
          inputMode="numeric"
          maxLength={23}
          placeholder={field.placeholder}
          {...common}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 23);
            updateForm({ [field.name]: value });
          }}
        />
      );
    }

    if (field.type === "currency") {
      return (
        <div className="currency-input-wrap">
          <span className="currency-prefix">$</span>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="off"
            id={field.name}
            disabled={field.readOnly || viewOnly}
            required={fieldRequired && !field.readOnly && !viewOnly}
            value={formatCOPThousands(form[field.name])}
            placeholder="0"
            onChange={(e) => {
              const digits = parseCOPDigits(e.target.value);
              updateForm({ [field.name]: digits });
            }}
          />
        </div>
      );
    }

    if (field.type === "number") {
      return (
        <input
          type="number"
          {...common}
          onChange={(e) => updateForm({ [field.name]: e.target.value })}
        />
      );
    }

    return (
      <input
        type={field.type === "email" ? "email" : "text"}
        placeholder={field.placeholder}
        {...common}
        onChange={(e) => handleFieldChange(field, e.target.value)}
      />
    );
  };

  const renderFormField = (field) => (
    <label
      key={field.name}
      className={
        field.fullWidth ? "full-width" : field.computed ? "computed-field" : ""
      }
    >
      <span className="field-label-row">
        <span>{field.label}</span>
        {isFieldRequired(field.name, requiredFields, module.key) && (
          <span className="required-mark">*</span>
        )}
        {field.computed && <span className="field-tag">Calculado</span>}
      </span>
      {renderField(field)}
      {field.validate23 && (
        <span
          className={`field-hint ${(form[field.name] || "").length === 23 ? "ok" : ""}`}
        >
          {(form[field.name] || "").length}/23 dígitos
        </span>
      )}
      {field.hint && !field.validate23 && (
        <span className="field-hint">{field.hint}</span>
      )}
      {field.hint && field.validate23 && (form[field.name] || "").length !== 23 && (
        <span className="field-hint">{field.hint}</span>
      )}
    </label>
  );

  const renderFormFieldsGrid = (fields) =>
    fields.length > 0 && (
      <div className="excel-form-grid">{fields.map(renderFormField)}</div>
    );

  return (
    <div className="page excel-page">
      <div className="page-header-row">
        <div>
          <h2>
            {module.label} <span className="badge">{module.crudName}</span>
          </h2>
          <p className="page-subtitle">
            Formulario basado en {module.excelName || module.crudName}.xlsx
          </p>
        </div>
        <div className="page-header-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden-file-input"
            onChange={handleImportFile}
          />
          {!showForm && canModify && (
            <button
              type="button"
              className="btn"
              onClick={handleImportClick}
              disabled={importing || loading}
            >
              {importing ? "Importando..." : "Importar Excel"}
            </button>
          )}
          <button
            type="button"
            className="btn"
            onClick={handleExport}
            disabled={exporting || loading || items.length === 0}
          >
            {exporting ? "Exportando..." : "Exportar Excel"}
          </button>
          {!showForm && canModify && (
            <button className="btn primary" onClick={openNewForm}>
              Nuevo registro
            </button>
          )}
          {!showForm && !canModify && (
            <span className="badge">Modo solo lectura</span>
          )}
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      {importResult && (
        <div className={`card import-result ${importResult.errors.length ? "partial" : "success"}`}>
          <p>
            Importación completada: <strong>{importResult.created}</strong> registro(s) creado(s).
          </p>
          {importResult.errors.length > 0 && (
            <ul className="import-errors">
              {importResult.errors.slice(0, 10).map((item) => (
                <li key={`${item.row}-${item.message}`}>
                  Fila Excel {item.row}: {item.message}
                </li>
              ))}
              {importResult.errors.length > 10 && (
                <li>… y {importResult.errors.length - 10} error(es) más.</li>
              )}
            </ul>
          )}
        </div>
      )}

      {showForm && (
        <div className="excel-form-panel">
        <form className="card form-card excel-form" onSubmit={handleSubmit}>
          <h3>
            {viewOnly ? "Ver registro" : editingId ? "Editar registro" : "Nuevo registro"}
          </h3>
          {!editingId && !viewOnly && (
            <p className="page-subtitle">
              El ID se asignará automáticamente al guardar el registro.
            </p>
          )}

          {(editingId || viewOnly) && (
            <div className="record-summary card">
              <p className="record-summary-title">
                {form.procesados || "Sin procesado"}
              </p>
              <p className="record-summary-meta">
                {[
                  form.causa && `Causa: ${form.causa}`,
                  form.estado_del_proceso && `Estado: ${form.estado_del_proceso}`,
                  form.numero_de_radicado_men_entrada &&
                    `Rad. entrada: ${form.numero_de_radicado_men_entrada}`,
                  form.registro_id && `ID ${form.registro_id}`,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
              {form.registro_id && (
                <SharePointFolderLink registroId={form.registro_id} />
              )}
            </div>
          )}

          <h4 className="form-section-title">DATOS DEL PROCESO</h4>
          {renderFormFieldsGrid(formFieldSections.datosProcesoBefore)}

          {formFieldSections.abogadoExternoFields.length > 0 && (
            <>
              {renderFormFieldsGrid(formFieldSections.abogadoExternoFields)}
              <h4 className="form-section-title">
                ACTUALIZACION INFORMACION ABOGADO EXTERNO
              </h4>
            </>
          )}

          {renderFormFieldsGrid(formFieldSections.datosProcesoMiddle)}

          {formFieldSections.audienciasFields.length > 0 && (
            <>
              <h4 className="form-section-title">AUDIENCIAS</h4>
              {renderFormFieldsGrid(formFieldSections.audienciasFields)}
            </>
          )}

          {renderFormFieldsGrid(formFieldSections.datosProcesoAfter)}

          <ActuacionesSection
            actuaciones={actuaciones}
            onChange={setActuaciones}
            readOnly={viewOnly}
          />
          <ReferenciaPdfSection
            referencia={referencia}
            pdfFile={pdfFile}
            onFileSelect={setPdfFile}
            onRemove={handleRemovePdf}
            readOnly={viewOnly}
          />

          <div className="form-section">
            <h4 className="form-section-title">DOCUMENTOS EN SHAREPOINT</h4>
            <p className="form-section-subtitle">
              Abre la carpeta del proceso en la biblioteca compartida del MEN.
            </p>
            <SharePointFolderLink registroId={form.registro_id} />
          </div>

          <div className="form-actions">
            {!viewOnly && (
            <button type="submit" className="btn primary" disabled={busy}>
              {busy ? "Guardando..." : editingId ? "Guardar cambios" : "Guardar"}
            </button>
            )}
            <button type="button" className="btn" onClick={resetFormState}>
              {viewOnly ? "Cerrar" : "Cancelar"}
            </button>
          </div>
        </form>
        </div>
      )}

      {!showForm &&
        (loading ? (
          <p>Cargando registros...</p>
        ) : (
          <div className="excel-list-view">
            <div className="table-filters card">
              <input
                type="search"
                placeholder="Buscar en la lista..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
              >
                <option value="">Todos los estados</option>
                {(catalogs[estadoCatalogKey] || []).map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <span className="filter-count">
                {filteredItems.length} de {items.length} registros
              </span>
            </div>
            <div className="table-scroll-panel">
            <table className="records-table">
              <thead>
                <tr>
                  <th>#</th>
                  {tableFields.map((field) => (
                    <th key={field.name}>{field.label}</th>
                  ))}
                  <th className="col-actions">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item.id}>
                    <td data-label="#">{index + 1}</td>
                    {tableFields.map((field) => {
                      const cellValue = formatValue(field, item[field.name]);
                      return (
                      <td
                        key={field.name}
                        data-label={field.label}
                        title={cellValue !== "—" ? cellValue : undefined}
                      >
                        {cellValue}
                      </td>
                      );
                    })}
                    <td data-label="Acciones" className="col-actions">
                      <div className="row-actions">
                        {item.registro_id && (
                          <SharePointFolderLink
                            registroId={item.registro_id}
                            compact
                            label="SharePoint"
                            className="btn small sharepoint-link"
                          />
                        )}
                        <button
                          className="btn small"
                          onClick={() => handleEdit(item, !canModify)}
                        >
                          {canModify ? "Editar" : "Ver"}
                        </button>
                        {canModify && (
                        <button
                          className="btn small danger"
                          onClick={() => handleDelete(item)}
                        >
                          Eliminar
                        </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={tableFields.length + 2}>
                      {items.length === 0
                        ? canModify
                          ? 'No hay registros. Pulsa "Nuevo registro" para llenar el formulario.'
                          : "No hay registros."
                        : "Ningún registro coincide con el filtro."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        ))}
    </div>
  );
}
