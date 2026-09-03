import { Router } from "express";
import { pool } from "../db.js";
import { computeCumplimiento, validateProceso23 } from "../helpers.js";

const TABLE = "cumplimiento_sentencias_hacer";
const router = Router();

const COLUMNS = [
  "abogado_a_cargo", "proceso", "radicado_er", "demandante", "demandados",
  "fecha_sentencia_primera_instancia", "corporacion_primera_instancia",
  "fecha_sentencia_segunda_instancia", "corporacion_segunda_instancia",
  "casacion", "fecha_sentencia_casacion", "corporacion_casacion",
  "obligacion_hacer", "entidades_responsables", "area_ministerio",
  "nombre_responsable_gestion", "plazo", "fecha_asignacion_sentencia",
  "fuente_recurso", "valor", "fecha_ultimo_seguimiento", "observaciones",
  "estado", "fecha_ejecutoria", "fecha_alerta_maxima", "fecha_maxima_cumplimiento",
  "fecha_traslado_cumplimiento", "validacion_oportunidad",
];

function sanitize(body) {
  const data = {};
  for (const col of COLUMNS) {
    if (body[col] !== undefined) data[col] = body[col] === "" ? null : body[col];
  }
  if (data.proceso) {
    data.proceso = validateProceso23(data.proceso, "Proceso");
  }
  return computeCumplimiento(data);
}

router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM ${TABLE} ORDER BY id DESC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/catalogos", async (_req, res) => {
  try {
    const [casacion] = await pool.query("SELECT nombre FROM cat_casacion ORDER BY nombre");
    const [area] = await pool.query("SELECT nombre FROM cat_area_ministerio ORDER BY nombre");
    const [estado] = await pool.query("SELECT nombre FROM cat_estado_cumplimiento ORDER BY nombre");
    res.json({
      casacion: casacion.map((r) => r.nombre),
      area_ministerio: area.map((r) => r.nombre),
      estado: estado.map((r) => r.nombre),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const data = sanitize(req.body);
    const cols = Object.keys(data);
    const placeholders = cols.map(() => "?").join(", ");
    const [result] = await pool.query(
      `INSERT INTO ${TABLE} (${cols.join(", ")}) VALUES (${placeholders})`,
      cols.map((c) => data[c])
    );
    res.status(201).json({ id: result.insertId, ...data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const data = sanitize(req.body);
    const sets = Object.keys(data).map((c) => `${c} = ?`).join(", ");
    await pool.query(`UPDATE ${TABLE} SET ${sets} WHERE id = ?`, [
      ...Object.values(data),
      req.params.id,
    ]);
    res.json({ id: Number(req.params.id), ...data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query(`DELETE FROM ${TABLE} WHERE id = ?`, [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
