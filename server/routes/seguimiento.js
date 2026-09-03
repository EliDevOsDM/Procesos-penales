import { Router } from "express";
import { pool } from "../db.js";
import { computeSeguimiento, validateProceso23 } from "../helpers.js";

const TABLE = "seguimiento_cobro";
const router = Router();

const COLUMNS = [
  "no_ref", "abogado_a_cargo", "numero_proceso", "demandante", "fecha_reporte",
  "clase_proceso", "demandado", "fecha_segundo_fallo", "fecha_ejecutoria", "condena",
  "fecha_radicado_solicitud_cobro", "estado_oaj", "fecha_gestion", "fecha_estimada_pago",
  "observaciones", "firma_men", "apoderado", "valor_cuantia_estimada", "resoluciones_pago",
  "fecha_alerta_maxima", "fecha_maxima_cumplimiento", "fecha_traslado_cumplimiento",
  "validacion_oportunidad",
];

function sanitize(body) {
  const data = {};
  for (const col of COLUMNS) {
    if (body[col] !== undefined) data[col] = body[col] === "" ? null : body[col];
  }
  if (data.numero_proceso) {
    data.numero_proceso = validateProceso23(data.numero_proceso);
  }
  return computeSeguimiento(data);
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
    const [clase] = await pool.query("SELECT nombre FROM cat_clase_proceso ORDER BY nombre");
    const [estado] = await pool.query("SELECT nombre FROM cat_estado_oaj ORDER BY nombre");
    const [firma] = await pool.query("SELECT nombre FROM cat_firma_men ORDER BY nombre");
    res.json({
      clase_proceso: clase.map((r) => r.nombre),
      estado_oaj: estado.map((r) => r.nombre),
      firma_men: firma.map((r) => r.nombre),
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
