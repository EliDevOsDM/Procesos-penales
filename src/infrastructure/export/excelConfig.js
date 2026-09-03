import { MODULES } from "../../domain/modules.js";

/** Columnas Procesos Penales.xlsx — hoja Activos (encabezado fila 2, datos fila 4+) */
export const PROCESOS_PENALES_COLUMNS = [
  {
    "col": 0,
    "field": "registro_id",
    "header": "ID"
  },
  {
    "col": 1,
    "field": "abogado_que_asigna",
    "header": "ABOGADO QUE ASIGNA"
  },
  {
    "col": 2,
    "field": "numero_de_radicado_men_entrada",
    "header": "NUMERO DE RADICADO MEN ENTRADA"
  },
  {
    "col": 3,
    "field": "fecha_de_radicado_men_entrada",
    "header": "FECHA DE RADICADO MEN ENTRADA",
    "type": "date"
  },
  {
    "col": 4,
    "field": "numero_de_radicado_men_salida",
    "header": "NUMERO DE RADICADO MEN SALIDA"
  },
  {
    "col": 5,
    "field": "fecha_de_radicado_men_salida",
    "header": "FECHA DE RADICADO MEN SALIDA",
    "type": "date"
  },
  {
    "col": 6,
    "field": "medio_de_envio",
    "header": "MEDIO DE ENVIO"
  },
  {
    "col": 7,
    "field": "otros_radicados",
    "header": "OTROS RADICADOS"
  },
  {
    "col": 8,
    "field": "men_fomag",
    "header": "MEN - FOMAG"
  },
  {
    "col": 9,
    "field": "solicitudes_allegadas_al_men",
    "header": "SOLICITUDES ALLEGADAS AL MEN"
  },
  {
    "col": 10,
    "field": "peticionario",
    "header": "PETICIONARIO"
  },
  {
    "col": 11,
    "field": "identificacion_del_procesados",
    "header": "IDENTIFICACION DEL PROCESADOS"
  },
  {
    "col": 12,
    "field": "procesados",
    "header": "PROCESADOS"
  },
  {
    "col": 13,
    "field": "causa",
    "header": "CAUSA"
  },
  {
    "col": 14,
    "field": "calidad_en_la_que_actua_el_men",
    "header": "CALIDAD EN LA QUE ACTUA EL MEN"
  },
  {
    "col": 15,
    "field": "radicado",
    "header": "RADICADO"
  },
  {
    "col": 16,
    "field": "departamento",
    "header": "DEPARTAMENTO"
  },
  {
    "col": 17,
    "field": "ciudad",
    "header": "CIUDAD"
  },
  {
    "col": 18,
    "field": "hechos",
    "header": "HECHOS"
  },
  {
    "col": 19,
    "field": "fiscal_de_preliminar",
    "header": "FISCAL DE PRELIMINAR"
  },
  {
    "col": 20,
    "field": "juez_de_preliminares",
    "header": "JUEZ DE PRELIMINARES"
  },
  {
    "col": 21,
    "field": "legalizacion_de_captura_y_otras_legalizacione",
    "header": "LEGALIZACION DE CAPTURA Y OTRAS LEGALIZACIONE"
  },
  {
    "col": 22,
    "field": "apelacion_auto_de_legalizacion_de_captura",
    "header": "APELACION - AUTO DE LEGALIZACION DE CAPTURA"
  },
  {
    "col": 23,
    "field": "imputacion_juridica_provisional",
    "header": "IMPUTACION JURIDICA PROVISIONAL"
  },
  {
    "col": 24,
    "field": "imputacion_de_cargos_aceptacion_si_no",
    "header": "IMPUTACION DE CARGOS (ACEPTACION SI / NO)"
  },
  {
    "col": 25,
    "field": "imposicion_medida_de_aseguramiento_si_no",
    "header": "IMPOSICION MEDIDA DE ASEGURAMIENTO (SI / NO)"
  },
  {
    "col": 26,
    "field": "apelacion_auto_de_imposicion_de_medida_de_aseguramiento_si_no",
    "header": "APELACION - AUTO DE IMPOSICION DE MEDIDA DE ASEGURAMIENTO (SI/NO)"
  },
  {
    "col": 27,
    "field": "privado_de_la_libertad_si_no",
    "header": "PRIVADO DE LA LIBERTAD (SI / NO)"
  },
  {
    "col": 28,
    "field": "celebracion_preacuero_si_no",
    "header": "CELEBRACION PREACUERO (SI / NO)"
  },
  {
    "col": 29,
    "field": "fecha_de_escrito_de_acusacion",
    "header": "FECHA DE ESCRITO DE ACUSACION",
    "type": "date"
  },
  {
    "col": 30,
    "field": "escrito_de_acusacion_si_no",
    "header": "ESCRITO DE ACUSACION (SI / NO)"
  },
  {
    "col": 31,
    "field": "fiscal_de_conocimiento",
    "header": "FISCAL DE CONOCIMIENTO"
  },
  {
    "col": 32,
    "field": "juzgado_de_conocimiento",
    "header": "JUZGADO DE CONOCIMIENTO"
  },
  {
    "col": 33,
    "field": "calificacion_juridica_definitiva_delitos",
    "header": "CALIFICACION JURIDICA DEFINITIVA (DELITOS)"
  },
  {
    "col": 34,
    "field": "audiencia_de_acusacion_si_no",
    "header": "AUDIENCIA DE ACUSACION (SI / NO)"
  },
  {
    "col": 35,
    "field": "fecha_audiencia_de_acusacion",
    "header": "FECHA AUDIENCIA DE ACUSACION",
    "type": "date"
  },
  {
    "col": 36,
    "field": "audiencia_preparatoria_si_no",
    "header": "AUDIENCIA PREPARATORIA (SI / NO )"
  },
  {
    "col": 37,
    "field": "fecha_de_audiencia_preparatoria",
    "header": "FECHA DE AUDIENCIA PREPARATORIA",
    "type": "date"
  },
  {
    "col": 38,
    "field": "audiencia_de_juicio_oral_si_no",
    "header": "AUDIENCIA DE JUICIO ORAL (SI / NO)"
  },
  {
    "col": 39,
    "field": "fecha_de_audiencia_de_juicio",
    "header": "FECHA DE AUDIENCIA DE JUICIO",
    "type": "date"
  },
  {
    "col": 40,
    "field": "fecha_sentencia_de_primera_instancia",
    "header": "FECHA SENTENCIA DE PRIMERA INSTANCIA",
    "type": "date"
  },
  {
    "col": 41,
    "field": "sentido_del_fallo_primera_instancia",
    "header": "SENTIDO DEL FALLO PRIMERA INSTANCIA"
  },
  {
    "col": 42,
    "field": "descripcion_del_fallo_de_primera_instancia",
    "header": "DESCRIPCION DEL FALLO DE PRIMERA INSTANCIA"
  },
  {
    "col": 43,
    "field": "lectura_de_sentencia_si_no",
    "header": "LECTURA DE SENTENCIA (SI / NO)"
  },
  {
    "col": 44,
    "field": "apelacion_si_no",
    "header": "APELACION (SI / NO)"
  },
  {
    "col": 45,
    "field": "tribunal_superior_y_magistrado",
    "header": "TRIBUNAL SUPERIOR Y MAGISTRADO"
  },
  {
    "col": 46,
    "field": "fecha_setencia_de_segunda_instancia",
    "header": "FECHA SETENCIA DE SEGUNDA INSTANCIA",
    "type": "date"
  },
  {
    "col": 47,
    "field": "sentido_del_fallo_segunda_instancia",
    "header": "SENTIDO DEL FALLO SEGUNDA INSTANCIA"
  },
  {
    "col": 48,
    "field": "descripcion_del_fallo_de_segunda_instancia",
    "header": "DESCRIPCION DEL FALLO DE SEGUNDA INSTANCIA"
  },
  {
    "col": 49,
    "field": "reconocimiento_de_victima_si_no",
    "header": "RECONOCIMIENTO DE VICTIMA (SI / NO)"
  },
  {
    "col": 50,
    "field": "incidente_de_reparacion_si_no",
    "header": "INCIDENTE DE REPARACION (SI / NO)"
  },
  {
    "col": 51,
    "field": "incidente_de_reparacion_valor_de_pretension_si_no",
    "header": "INCIDENTE DE REPARACION (VALOR DE PRETENSION) (SI / NO)"
  },
  {
    "col": 52,
    "field": "ejecucion_de_obligacion_si_no",
    "header": "EJECUCION DE OBLIGACION (SI / NO)"
  },
  {
    "col": 53,
    "field": "resumen_de_actuacion_anterior",
    "header": "RESUMEN DE ACTUACION ANTERIOR"
  },
  {
    "col": 54,
    "field": "etapa_procesal_actual",
    "header": "ETAPA PROCESAL ACTUAL"
  },
  {
    "col": 56,
    "field": "observaciones",
    "header": "OBSERVACIONES"
  },
  {
    "col": 57,
    "field": "expediente_digital",
    "header": "EXPEDIENTE DIGITAL"
  },
  {
    "col": 58,
    "field": "estado_del_proceso",
    "header": "ESTADO DEL PROCESO"
  }
];

export const EXCEL_MODULE_CONFIG = {
  [MODULES.PROCESOS_PENALES]: {
    sheetNames: ["Activos"],
    mainSheetName: "Activos",
    actuacionesSheetName: "Actuaciones",
    fileName: "Procesos Penales.xlsx",
    headerRow: 0,
    dataStartRow: 1,
    keyField: "registro_id",
    keyHeader: "ID",
    skipKeyValidation: true,
    columns: PROCESOS_PENALES_COLUMNS,
  },
};
