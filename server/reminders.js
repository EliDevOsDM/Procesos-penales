/**
 * =============================================================================
 * RECORDATORIOS — Procesos Penales (editar con nano)
 * =============================================================================
 *
 * Instalacion (una vez en el servidor):
 *   npm install firebase-admin node-cron
 *
 * Uso:
 *   node reminders.js --once    → prueba ahora
 *   node reminders.js           → programado cada dia 8:00 AM Colombia
 * =============================================================================
 */

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const cron = require("node-cron");

// ─── EDITA ESTO ──────────────────────────────────────────────────────────────

const CONFIG = {
  firebaseProjectId: "TU_PROJECT_ID",
  brevoApiKey: "TU_BREVO_API_KEY",
  brevoSenderEmail: "tu-correo-verificado@gmail.com",
  brevoSenderName: "Procesos Penales",
  extraNotifyEmails: ["admin@ejemplo.com"],
  cronSchedule: "0 8 * * *",
  timezone: "America/Bogota",
};

/** Firebase Console → Configuración → Cuentas de servicio → Generar clave JSON */
const SERVICE_ACCOUNT = {
  type: "service_account",
  project_id: "TU_PROJECT_ID",
  private_key_id: "TU_PRIVATE_KEY_ID",
  private_key: "-----BEGIN PRIVATE KEY-----\nPEGA_AQUI_TU_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-xxxxx@TU_PROJECT_ID.iam.gserviceaccount.com",
  client_id: "TU_CLIENT_ID",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40TU_PROJECT_ID.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// ─── NO EDITAR DEBAJO (salvo que sepas lo que haces) ─────────────────────────

const MODULES = [
  {
    collection: "seguimiento_cobro",
    label: "Obligaciones de dar",
    estadoField: "estado_oaj",
    procesoField: "numero_proceso",
    closedStates: ["PAGADO", "TRASLADADO"],
  },
  {
    collection: "cumplimiento_sentencias_hacer",
    label: "Obligaciones de hacer",
    estadoField: "estado",
    procesoField: "proceso",
    closedStates: ["CUMPLIDO", "TRASLADADO"],
  },
];

function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CONFIG.timezone }).format(new Date());
}

function getDb() {
  if (!getApps().length) {
    initializeApp({
      credential: cert(SERVICE_ACCOUNT),
      projectId: CONFIG.firebaseProjectId,
    });
  }
  return getFirestore();
}

function uniqueEmails(emails) {
  const seen = new Set();
  const result = [];
  for (const raw of emails) {
    const email = String(raw || "").trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    result.push(email);
  }
  return result;
}

function getNotifyRecipients(recordEmail) {
  return uniqueEmails([
    recordEmail,
    ...(CONFIG.extraNotifyEmails || []),
  ]);
}

async function sendEmail(mail) {
  if (!CONFIG.brevoApiKey || CONFIG.brevoApiKey.includes("PEGAR")) {
    throw new Error("Falta brevoApiKey en CONFIG (arriba del archivo).");
  }
  if (!CONFIG.brevoSenderEmail || CONFIG.brevoSenderEmail.includes("tu-correo")) {
    throw new Error("Falta brevoSenderEmail verificado en Brevo.");
  }

  const recipients = uniqueEmails(Array.isArray(mail.to) ? mail.to : [mail.to]);
  if (!recipients.length) {
    throw new Error("No hay destinatarios para el correo.");
  }

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": CONFIG.brevoApiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: CONFIG.brevoSenderName,
        email: CONFIG.brevoSenderEmail,
      },
      to: recipients.map((email) => ({ email })),
      subject: mail.subject,
      textContent: mail.message,
    }),
  });

  if (!res.ok) {
    throw new Error("Brevo: " + (await res.text()));
  }

  return recipients;
}

function isClosed(record, module) {
  const estado = record[module.estadoField];
  return Boolean(estado && module.closedStates.includes(estado));
}

function normalizeDate(value) {
  return String(value ?? "").slice(0, 10);
}

function shouldSendAlert(record, today) {
  const email = record.correo_notificacion && String(record.correo_notificacion).trim();
  if (!email) return false;

  const fechaAlerta = normalizeDate(record.fecha_alerta_maxima);
  if (!fechaAlerta) return false;
  if (fechaAlerta > today) return false;

  // Guarda la fecha de alerta notificada; si cambia, vuelve a enviar.
  const sentFor = normalizeDate(record.notificaciones && record.notificaciones.alerta_maxima_enviada);
  if (sentFor === fechaAlerta) return false;

  return true;
}

function buildEmail(module, record) {
  const proceso = record[module.procesoField] || "—";
  const demandante = record.demandante || "—";
  const fecha = record.fecha_alerta_maxima || "—";
  return {
    to: getNotifyRecipients(String(record.correo_notificacion).trim()),
    subject: "[Procesos Penales] Alerta maxima de cumplimiento — " + proceso,
    message:
      "Se ha alcanzado la fecha de alerta maxima de cumplimiento.\n\n" +
      "Modulo: " + module.label + "\n" +
      "Proceso: " + proceso + "\n" +
      "Demandante: " + demandante + "\n" +
      "Fecha alerta maxima: " + fecha + "\n" +
      "Estado: " + (record[module.estadoField] || "—") + "\n\n" +
      "Panel Procesos Penales.",
  };
}

async function runReminderJob() {
  const db = getDb();
  const today = todayISO();
  let sent = 0;

  console.log("[" + new Date().toISOString() + "] Revisando fecha_alerta_maxima — " + today);

  for (const module of MODULES) {
    const snapshot = await db.collection(module.collection).get();
    let moduleSent = 0;

    for (const doc of snapshot.docs) {
      const record = Object.assign({ id: doc.id }, doc.data());
      if (isClosed(record, module)) continue;
      if (!shouldSendAlert(record, today)) continue;

      const mail = buildEmail(module, record);
      try {
        const recipients = await sendEmail(mail);

        await doc.ref.set(
          {
            notificaciones: Object.assign({}, record.notificaciones || {}, {
              alerta_maxima_enviada: normalizeDate(record.fecha_alerta_maxima),
            }),
          },
          { merge: true }
        );

        moduleSent += 1;
        sent += 1;
        console.log(
          "  OK " + recipients.join(", ") + " · " + (record[module.procesoField] || doc.id)
        );
      } catch (err) {
        console.error(
          "  ERROR " +
            (Array.isArray(mail.to) ? mail.to.join(", ") : mail.to) +
            " · " +
            err.message
        );
      }
    }

    console.log("  " + module.label + ": " + moduleSent + " correo(s)");
  }

  console.log("Total enviados: " + sent);
  return sent;
}

const runOnce = process.argv.includes("--once");

if (runOnce) {
  runReminderJob()
    .then(function () { process.exit(0); })
    .catch(function (err) { console.error(err); process.exit(1); });
} else {
  console.log('Programado: "' + CONFIG.cronSchedule + '" (' + CONFIG.timezone + ")");
  console.log("Proyecto: " + CONFIG.firebaseProjectId);
  console.log("Activo. Ctrl+C para detener.\n");

  cron.schedule(
    CONFIG.cronSchedule,
    function () { runReminderJob().catch(console.error); },
    { timezone: CONFIG.timezone }
  );
}
