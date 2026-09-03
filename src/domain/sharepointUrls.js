const SHAREPOINT_HOST = "https://mineducaciongovco.sharepoint.com";
const SITE_PATH = "/sites/BASE_COMPARTIDA_PENALES";
const DOCUMENT_LIBRARY = "Documentos compartidos";
const BASE_FOLDER = "ANEXOS BASE ASUNTOS PENALES";
const LIBRARY_VIEW_ID = "9af6bc95-d35c-41bc-9fc0-c5ed4c57e6f4";

/** Ruta del servidor (sin host) a la carpeta del registro. */
export function getSharePointAnexosFolderPath(registroId) {
  const id = String(registroId ?? "").trim();
  if (!id) return null;
  return `${SITE_PATH}/${DOCUMENT_LIBRARY}/${BASE_FOLDER}/${id}`;
}

/** URL para abrir la carpeta del registro en SharePoint. */
export function buildSharePointAnexosFolderUrl(registroId) {
  const folderPath = getSharePointAnexosFolderPath(registroId);
  if (!folderPath) return null;

  const librarySegment = encodeURIComponent(DOCUMENT_LIBRARY);
  const viewId = encodeURIComponent(LIBRARY_VIEW_ID);
  const folderId = encodeURIComponent(folderPath);

  return `${SHAREPOINT_HOST}${SITE_PATH}/${librarySegment}/Forms/AllItems.aspx?viewid=${viewId}&id=${folderId}`;
}
