import { buildSharePointAnexosFolderUrl } from "../../domain/sharepointUrls.js";

export default function SharePointFolderLink({
  registroId,
  className = "btn small sharepoint-link",
  label = "Abrir carpeta SharePoint",
  compact = false,
}) {
  const url = buildSharePointAnexosFolderUrl(registroId);

  if (!url) {
    return compact ? null : (
      <p className="sharepoint-hint muted-text">
        La carpeta de SharePoint estará disponible cuando el registro tenga ID.
      </p>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={className}
      title="Abrir carpeta del proceso en SharePoint"
    >
      {label}
    </a>
  );
}
