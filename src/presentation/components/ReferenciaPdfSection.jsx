export default function ReferenciaPdfSection({
  referencia,
  pdfFile,
  onFileSelect,
  onRemove,
  readOnly = false,
}) {
  return (
    <div className="form-section">
      <h4 className="form-section-title">REFERENCIAS</h4>
      <p className="form-section-subtitle">
        Suba un documento PDF de soporte o referencia.
      </p>

      {referencia?.url && !pdfFile && (
        <div className="pdf-current">
          <a href={referencia.url} target="_blank" rel="noreferrer">
            {referencia.name || "Ver PDF"}
          </a>
          {!readOnly && (
          <button type="button" className="btn small danger" onClick={onRemove}>
            Quitar PDF
          </button>
          )}
        </div>
      )}

      {!readOnly && (
      <label className="pdf-upload">
        {pdfFile ? pdfFile.name : "Seleccionar archivo PDF"}
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => onFileSelect(e.target.files?.[0] || null)}
        />
      </label>
      )}
    </div>
  );
}
