import express from "express";
import cors from "cors";
import seguimientoRouter from "./routes/seguimiento.js";
import cumplimientoRouter from "./routes/cumplimiento.js";

const app = express();
const PORT = process.env.API_PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/seguimiento", seguimientoRouter);
app.use("/api/cumplimiento", cumplimientoRouter);

app.listen(PORT, () => {
  console.log(`API MySQL corriendo en http://localhost:${PORT}`);
});
