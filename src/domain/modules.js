// Módulo Procesos Penales — campos desde Procesos Penales.xlsx
// Regenerar listas: node scripts/generate-procesos-penales-data.js

export const MODULES = {
  PROCESOS_PENALES: "procesos_penales",
};

const procesosPenalesFields = [
  {
    "name": "registro_id",
    "label": "ID",
    "type": "number",
    "readOnly": true,
    "autoId": true,
    "table": true
  },
  {
    "name": "abogado_que_asigna",
    "label": "ABOGADO QUE ASIGNA",
    "type": "select",
    "catalogKey": "abogado_que_asigna"
  },
  {
    "name": "numero_de_radicado_men_entrada",
    "label": "NUMERO DE RADICADO MEN ENTRADA",
    "type": "text"
  },
  {
    "name": "fecha_de_radicado_men_entrada",
    "label": "FECHA DE RADICADO MEN ENTRADA",
    "type": "date",
    "alertDate": false
  },
  {
    "name": "numero_de_radicado_men_salida",
    "label": "NUMERO DE RADICADO MEN SALIDA",
    "type": "text"
  },
  {
    "name": "fecha_de_radicado_men_salida",
    "label": "FECHA DE RADICADO MEN SALIDA",
    "type": "date",
    "alertDate": false
  },
  {
    "name": "medio_de_envio",
    "label": "MEDIO DE ENVIO",
    "type": "select",
    "catalogKey": "medio_de_envio"
  },
  {
    "name": "otros_radicados",
    "label": "OTROS RADICADOS",
    "type": "text"
  },
  {
    "name": "men_fomag",
    "label": "MEN - FOMAG",
    "type": "select",
    "catalogKey": "men_fomag"
  },
  {
    "name": "solicitudes_allegadas_al_men",
    "label": "SOLICITUDES ALLEGADAS AL MEN",
    "type": "text"
  },
  {
    "name": "peticionario",
    "label": "PETICIONARIO",
    "type": "text"
  },
  {
    "name": "identificacion_del_procesados",
    "label": "IDENTIFICACION DEL PROCESADOS",
    "type": "text"
  },
  {
    "name": "procesados",
    "label": "PROCESADOS",
    "type": "text",
    "table": true
  },
  {
    "name": "causa",
    "label": "CAUSA",
    "type": "select",
    "catalogKey": "causa",
    "table": true
  },
  {
    "name": "calidad_en_la_que_actua_el_men",
    "label": "CALIDAD EN LA QUE ACTUA EL MEN",
    "type": "select",
    "catalogKey": "calidad_en_la_que_actua_el_men",
    "table": true
  },
  {
    "name": "radicado",
    "label": "RADICADO",
    "type": "text",
    "table": true
  },
  {
    "name": "departamento",
    "label": "DEPARTAMENTO",
    "type": "select",
    "catalogKey": "departamento"
  },
  {
    "name": "ciudad",
    "label": "CIUDAD",
    "type": "select",
    "catalogKey": "ciudad"
  },
  {
    "name": "hechos",
    "label": "HECHOS",
    "type": "textarea",
    "fullWidth": true
  },
  {
    "name": "fiscal_de_preliminar",
    "label": "FISCAL DE PRELIMINAR",
    "type": "text"
  },
  {
    "name": "juez_de_preliminares",
    "label": "JUEZ DE PRELIMINARES",
    "type": "text"
  },
  {
    "name": "legalizacion_de_captura_y_otras_legalizacione",
    "label": "LEGALIZACION DE CAPTURA Y OTRAS LEGALIZACIONE",
    "type": "select",
    "catalogKey": "legalizacion_de_captura_y_otras_legalizacione"
  },
  {
    "name": "apelacion_auto_de_legalizacion_de_captura",
    "label": "APELACION - AUTO DE LEGALIZACION DE CAPTURA",
    "type": "select",
    "catalogKey": "apelacion_auto_de_legalizacion_de_captura"
  },
  {
    "name": "imputacion_juridica_provisional",
    "label": "IMPUTACION JURIDICA PROVISIONAL",
    "type": "select",
    "catalogKey": "imputacion_juridica_provisional"
  },
  {
    "name": "imputacion_de_cargos_aceptacion_si_no",
    "label": "IMPUTACION DE CARGOS (ACEPTACION SI / NO)",
    "type": "select",
    "catalogKey": "imputacion_de_cargos_aceptacion_si_no"
  },
  {
    "name": "imposicion_medida_de_aseguramiento_si_no",
    "label": "IMPOSICION MEDIDA DE ASEGURAMIENTO (SI / NO)",
    "type": "select",
    "catalogKey": "imposicion_medida_de_aseguramiento_si_no"
  },
  {
    "name": "apelacion_auto_de_imposicion_de_medida_de_aseguramiento_si_no",
    "label": "APELACION - AUTO DE IMPOSICION DE MEDIDA DE ASEGURAMIENTO (SI/NO)",
    "type": "select",
    "catalogKey": "apelacion_auto_de_imposicion_de_medida_de_aseguramiento_si_no"
  },
  {
    "name": "privado_de_la_libertad_si_no",
    "label": "PRIVADO DE LA LIBERTAD (SI / NO)",
    "type": "select",
    "catalogKey": "privado_de_la_libertad_si_no"
  },
  {
    "name": "celebracion_preacuero_si_no",
    "label": "CELEBRACION PREACUERO (SI / NO)",
    "type": "select",
    "catalogKey": "celebracion_preacuero_si_no"
  },
  {
    "name": "fecha_de_escrito_de_acusacion",
    "label": "FECHA DE ESCRITO DE ACUSACION",
    "type": "date",
    "alertDate": false
  },
  {
    "name": "escrito_de_acusacion_si_no",
    "label": "ESCRITO DE ACUSACION (SI / NO)",
    "type": "select",
    "catalogKey": "escrito_de_acusacion_si_no"
  },
  {
    "name": "fiscal_de_conocimiento",
    "label": "FISCAL DE CONOCIMIENTO",
    "type": "text"
  },
  {
    "name": "juzgado_de_conocimiento",
    "label": "JUZGADO DE CONOCIMIENTO",
    "type": "text"
  },
  {
    "name": "calificacion_juridica_definitiva_delitos",
    "label": "CALIFICACION JURIDICA DEFINITIVA (DELITOS)",
    "type": "select",
    "catalogKey": "calificacion_juridica_definitiva_delitos"
  },
  {
    "name": "audiencia_de_acusacion_si_no",
    "label": "AUDIENCIA DE ACUSACION (SI / NO)",
    "type": "select",
    "catalogKey": "audiencia_de_acusacion_si_no"
  },
  {
    "name": "fecha_audiencia_de_acusacion",
    "label": "FECHA AUDIENCIA DE ACUSACION",
    "type": "date",
    "alertDate": true
  },
  {
    "name": "audiencia_preparatoria_si_no",
    "label": "AUDIENCIA PREPARATORIA (SI / NO )",
    "type": "select",
    "catalogKey": "audiencia_preparatoria_si_no"
  },
  {
    "name": "fecha_de_audiencia_preparatoria",
    "label": "FECHA DE AUDIENCIA PREPARATORIA",
    "type": "date",
    "alertDate": true
  },
  {
    "name": "audiencia_de_juicio_oral_si_no",
    "label": "AUDIENCIA DE JUICIO ORAL (SI / NO)",
    "type": "select",
    "catalogKey": "audiencia_de_juicio_oral_si_no"
  },
  {
    "name": "fecha_de_audiencia_de_juicio",
    "label": "FECHA DE AUDIENCIA DE JUICIO",
    "type": "date",
    "alertDate": true
  },
  {
    "name": "fecha_sentencia_de_primera_instancia",
    "label": "FECHA SENTENCIA DE PRIMERA INSTANCIA",
    "type": "date",
    "alertDate": false
  },
  {
    "name": "sentido_del_fallo_primera_instancia",
    "label": "SENTIDO DEL FALLO PRIMERA INSTANCIA",
    "type": "select",
    "catalogKey": "sentido_del_fallo_primera_instancia"
  },
  {
    "name": "descripcion_del_fallo_de_primera_instancia",
    "label": "DESCRIPCION DEL FALLO DE PRIMERA INSTANCIA",
    "type": "textarea",
    "fullWidth": true
  },
  {
    "name": "lectura_de_sentencia_si_no",
    "label": "LECTURA DE SENTENCIA (SI / NO)",
    "type": "select",
    "catalogKey": "lectura_de_sentencia_si_no"
  },
  {
    "name": "apelacion_si_no",
    "label": "APELACION (SI / NO)",
    "type": "select",
    "catalogKey": "apelacion_si_no"
  },
  {
    "name": "tribunal_superior_y_magistrado",
    "label": "TRIBUNAL SUPERIOR Y MAGISTRADO",
    "type": "text"
  },
  {
    "name": "fecha_setencia_de_segunda_instancia",
    "label": "FECHA SETENCIA DE SEGUNDA INSTANCIA",
    "type": "date",
    "alertDate": false
  },
  {
    "name": "sentido_del_fallo_segunda_instancia",
    "label": "SENTIDO DEL FALLO SEGUNDA INSTANCIA",
    "type": "select",
    "catalogKey": "sentido_del_fallo_segunda_instancia"
  },
  {
    "name": "descripcion_del_fallo_de_segunda_instancia",
    "label": "DESCRIPCION DEL FALLO DE SEGUNDA INSTANCIA",
    "type": "textarea",
    "fullWidth": true
  },
  {
    "name": "reconocimiento_de_victima_si_no",
    "label": "RECONOCIMIENTO DE VICTIMA (SI / NO)",
    "type": "select",
    "catalogKey": "reconocimiento_de_victima_si_no"
  },
  {
    "name": "incidente_de_reparacion_si_no",
    "label": "INCIDENTE DE REPARACION (SI / NO)",
    "type": "select",
    "catalogKey": "incidente_de_reparacion_si_no"
  },
  {
    "name": "incidente_de_reparacion_valor_de_pretension_si_no",
    "label": "INCIDENTE DE REPARACION (VALOR DE PRETENSION) (SI / NO)",
    "type": "select",
    "catalogKey": "incidente_de_reparacion_valor_de_pretension_si_no"
  },
  {
    "name": "ejecucion_de_obligacion_si_no",
    "label": "EJECUCION DE OBLIGACION (SI / NO)",
    "type": "select",
    "catalogKey": "ejecucion_de_obligacion_si_no"
  },
  {
    "name": "resumen_de_actuacion_anterior",
    "label": "RESUMEN DE ACTUACION ANTERIOR",
    "type": "textarea",
    "fullWidth": true
  },
  {
    "name": "etapa_procesal_actual",
    "label": "ETAPA PROCESAL ACTUAL",
    "type": "select",
    "catalogKey": "etapa_procesal_actual",
    "table": true
  },
  {
    "name": "observaciones",
    "label": "OBSERVACIONES",
    "type": "textarea",
    "fullWidth": true
  },
  {
    "name": "expediente_digital",
    "label": "EXPEDIENTE DIGITAL",
    "type": "select",
    "catalogKey": "expediente_digital"
  },
  {
    "name": "estado_del_proceso",
    "label": "ESTADO DEL PROCESO",
    "type": "select",
    "catalogKey": "estado_del_proceso",
    "table": true
  }
];

export const MODULE_LIST = [
  {
    key: MODULES.PROCESOS_PENALES,
    label: "Procesos Penales",
    navLabel: "Procesos Penales",
    crudName: "Procesos Penales",
    excelName: "Procesos Penales",
    collection: "procesos_penales",
    computeFields: null,
    estadoField: "estado_del_proceso",
    estadoCatalogKey: "estado_del_proceso",
    etapaField: "etapa_procesal_actual",
    fields: procesosPenalesFields,
  },
];

export const ALL_MODULE_KEYS = MODULE_LIST.map((m) => m.key);
export const getModule = (key) => MODULE_LIST.find((m) => m.key === key);
