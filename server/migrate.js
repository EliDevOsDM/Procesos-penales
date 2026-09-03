import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  multipleStatements: true,
};

async function migrate() {
  const conn = await mysql.createConnection(config);
  const sql = fs.readFileSync(path.join(__dirname, "../database/schema.sql"), "utf8");
  await conn.query(sql);
  await conn.end();
  console.log("✓ Base de datos panel_luis creada correctamente.");
}

migrate().catch((err) => {
  console.error("Error en migración:", err.message);
  process.exit(1);
});
