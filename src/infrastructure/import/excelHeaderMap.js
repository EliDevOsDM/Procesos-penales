import { MODULES } from "../../domain/modules.js";

export const HEADER_FIELD_RULES = {
  [MODULES.PROCESOS_PENALES]: [
  {
    "field": "abogado_que_asigna",
    "patterns": [
      "ABOGADO QUE ASIGNA"
    ]
  },
  {
    "field": "numero_de_radicado_men_entrada",
    "patterns": [
      "NUMERO DE RADICADO MEN ENTRADA"
    ]
  },
  {
    "field": "fecha_de_radicado_men_entrada",
    "patterns": [
      "FECHA DE RADICADO MEN ENTRADA"
    ]
  },
  {
    "field": "numero_de_radicado_men_salida",
    "patterns": [
      "NUMERO DE RADICADO MEN SALIDA"
    ]
  },
  {
    "field": "fecha_de_radicado_men_salida",
    "patterns": [
      "FECHA DE RADICADO MEN SALIDA"
    ]
  },
  {
    "field": "medio_de_envio",
    "patterns": [
      "MEDIO DE ENVIO"
    ]
  },
  {
    "field": "otros_radicados",
    "patterns": [
      "OTROS RADICADOS"
    ]
  },
  {
    "field": "men_fomag",
    "patterns": [
      "MEN - FOMAG"
    ]
  },
  {
    "field": "solicitudes_allegadas_al_men",
    "patterns": [
      "SOLICITUDES ALLEGADAS AL MEN"
    ]
  },
  {
    "field": "peticionario",
    "patterns": [
      "PETICIONARIO"
    ]
  },
  {
    "field": "identificacion_del_procesados",
    "patterns": [
      "IDENTIFICACION DEL PROCESADOS"
    ]
  },
  {
    "field": "procesados",
    "patterns": [
      "PROCESADOS"
    ]
  },
  {
    "field": "causa",
    "patterns": [
      "CAUSA"
    ]
  },
  {
    "field": "calidad_en_la_que_actua_el_men",
    "patterns": [
      "CALIDAD EN LA QUE ACTUA EL MEN"
    ]
  },
  {
    "field": "radicado",
    "patterns": [
      "RADICADO"
    ]
  },
  {
    "field": "departamento",
    "patterns": [
      "DEPARTAMENTO"
    ]
  },
  {
    "field": "ciudad",
    "patterns": [
      "CIUDAD"
    ]
  },
  {
    "field": "hechos",
    "patterns": [
      "HECHOS"
    ]
  },
  {
    "field": "fiscal_de_preliminar",
    "patterns": [
      "FISCAL DE PRELIMINAR"
    ]
  },
  {
    "field": "juez_de_preliminares",
    "patterns": [
      "JUEZ DE PRELIMINARES"
    ]
  },
  {
    "field": "legalizacion_de_captura_y_otras_legalizacione",
    "patterns": [
      "LEGALIZACION DE CAPTURA Y OTRAS LEGALIZACIONE"
    ]
  },
  {
    "field": "apelacion_auto_de_legalizacion_de_captura",
    "patterns": [
      "APELACION - AUTO DE LEGALIZACION DE CAPTURA"
    ]
  },
  {
    "field": "imputacion_juridica_provisional",
    "patterns": [
      "IMPUTACION JURIDICA PROVISIONAL"
    ]
  },
  {
    "field": "imputacion_de_cargos_aceptacion_si_no",
    "patterns": [
      "IMPUTACION DE CARGOS (ACEPTACION SI / NO)"
    ]
  },
  {
    "field": "imposicion_medida_de_aseguramiento_si_no",
    "patterns": [
      "IMPOSICION MEDIDA DE ASEGURAMIENTO (SI / NO)"
    ]
  },
  {
    "field": "apelacion_auto_de_imposicion_de_medida_de_aseguramiento_si_no",
    "patterns": [
      "APELACION - AUTO DE IMPOSICION DE MEDIDA DE ASEGURAMIENTO (SI/NO)"
    ]
  },
  {
    "field": "privado_de_la_libertad_si_no",
    "patterns": [
      "PRIVADO DE LA LIBERTAD (SI / NO)"
    ]
  },
  {
    "field": "celebracion_preacuero_si_no",
    "patterns": [
      "CELEBRACION PREACUERO (SI / NO)"
    ]
  },
  {
    "field": "fecha_de_escrito_de_acusacion",
    "patterns": [
      "FECHA DE ESCRITO DE ACUSACION"
    ]
  },
  {
    "field": "escrito_de_acusacion_si_no",
    "patterns": [
      "ESCRITO DE ACUSACION (SI / NO)"
    ]
  },
  {
    "field": "fiscal_de_conocimiento",
    "patterns": [
      "FISCAL DE CONOCIMIENTO"
    ]
  },
  {
    "field": "juzgado_de_conocimiento",
    "patterns": [
      "JUZGADO DE CONOCIMIENTO"
    ]
  },
  {
    "field": "calificacion_juridica_definitiva_delitos",
    "patterns": [
      "CALIFICACION JURIDICA DEFINITIVA (DELITOS)"
    ]
  },
  {
    "field": "audiencia_de_acusacion_si_no",
    "patterns": [
      "AUDIENCIA DE ACUSACION (SI / NO)"
    ]
  },
  {
    "field": "fecha_audiencia_de_acusacion",
    "patterns": [
      "FECHA AUDIENCIA DE ACUSACION"
    ]
  },
  {
    "field": "audiencia_preparatoria_si_no",
    "patterns": [
      "AUDIENCIA PREPARATORIA (SI / NO )"
    ]
  },
  {
    "field": "fecha_de_audiencia_preparatoria",
    "patterns": [
      "FECHA DE AUDIENCIA PREPARATORIA"
    ]
  },
  {
    "field": "audiencia_de_juicio_oral_si_no",
    "patterns": [
      "AUDIENCIA DE JUICIO ORAL (SI / NO)"
    ]
  },
  {
    "field": "fecha_de_audiencia_de_juicio",
    "patterns": [
      "FECHA DE AUDIENCIA DE JUICIO"
    ]
  },
  {
    "field": "fecha_sentencia_de_primera_instancia",
    "patterns": [
      "FECHA SENTENCIA DE PRIMERA INSTANCIA"
    ]
  },
  {
    "field": "sentido_del_fallo_primera_instancia",
    "patterns": [
      "SENTIDO DEL FALLO PRIMERA INSTANCIA"
    ]
  },
  {
    "field": "descripcion_del_fallo_de_primera_instancia",
    "patterns": [
      "DESCRIPCION DEL FALLO DE PRIMERA INSTANCIA"
    ]
  },
  {
    "field": "lectura_de_sentencia_si_no",
    "patterns": [
      "LECTURA DE SENTENCIA (SI / NO)"
    ]
  },
  {
    "field": "apelacion_si_no",
    "patterns": [
      "APELACION (SI / NO)"
    ]
  },
  {
    "field": "tribunal_superior_y_magistrado",
    "patterns": [
      "TRIBUNAL SUPERIOR Y MAGISTRADO"
    ]
  },
  {
    "field": "fecha_setencia_de_segunda_instancia",
    "patterns": [
      "FECHA SETENCIA DE SEGUNDA INSTANCIA"
    ]
  },
  {
    "field": "sentido_del_fallo_segunda_instancia",
    "patterns": [
      "SENTIDO DEL FALLO SEGUNDA INSTANCIA"
    ]
  },
  {
    "field": "descripcion_del_fallo_de_segunda_instancia",
    "patterns": [
      "DESCRIPCION DEL FALLO DE SEGUNDA INSTANCIA"
    ]
  },
  {
    "field": "reconocimiento_de_victima_si_no",
    "patterns": [
      "RECONOCIMIENTO DE VICTIMA (SI / NO)"
    ]
  },
  {
    "field": "incidente_de_reparacion_si_no",
    "patterns": [
      "INCIDENTE DE REPARACION (SI / NO)"
    ]
  },
  {
    "field": "incidente_de_reparacion_valor_de_pretension_si_no",
    "patterns": [
      "INCIDENTE DE REPARACION (VALOR DE PRETENSION) (SI / NO)"
    ]
  },
  {
    "field": "ejecucion_de_obligacion_si_no",
    "patterns": [
      "EJECUCION DE OBLIGACION (SI / NO)"
    ]
  },
  {
    "field": "resumen_de_actuacion_anterior",
    "patterns": [
      "RESUMEN DE ACTUACION ANTERIOR"
    ]
  },
  {
    "field": "etapa_procesal_actual",
    "patterns": [
      "ETAPA PROCESAL ACTUAL"
    ]
  },
  {
    "field": "observaciones",
    "patterns": [
      "OBSERVACIONES"
    ]
  },
  {
    "field": "expediente_digital",
    "patterns": [
      "EXPEDIENTE DIGITAL"
    ]
  },
  {
    "field": "estado_del_proceso",
    "patterns": [
      "ESTADO DEL PROCESO"
    ]
  }
],
};

export function normalizeHeader(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

export function matchHeaderToField(moduleKey, headerText) {
  const normalized = normalizeHeader(headerText);
  if (!normalized || normalized === "#" || normalized === "ITEM") return null;

  const rules = HEADER_FIELD_RULES[moduleKey] || [];

  for (const rule of rules) {
    for (const pattern of rule.patterns) {
      const p = normalizeHeader(pattern);
      if (normalized === p || normalized.includes(p)) {
        return rule.field;
      }
    }
  }

  return null;
}

export function matchHeaderToFieldStrict(moduleKey, headerText, col, usedFields) {
  const field = matchHeaderToField(moduleKey, headerText);
  if (!field || usedFields.has(field)) return null;
  return field;
}
