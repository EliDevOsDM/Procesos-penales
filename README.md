# Procesos Penales

Panel clon del seguimiento MEN, con la misma funcionalidad (Dar, Hacer, roles, Excel, KPIs, alertas).

## Antes de empezar

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Activa **Authentication** (correo/contraseña), **Firestore** y **Storage**
3. Registra una app **Web** y copia la configuración SDK

## Configurar Firebase (frontend)

Edita `src/infrastructure/firebase/config.js` y reemplaza:

```javascript
apiKey: "TU_API_KEY",
authDomain: "TU_PROJECT_ID.firebaseapp.com",
projectId: "TU_PROJECT_ID",
// ...
```

Edita `.firebaserc` y pon tu `projectId`:

```json
{ "projects": { "default": "TU_PROJECT_ID" } }
```

## Reglas Firestore

Publica `firestore.rules` cuando estés listo:

```bash
firebase login
firebase deploy --only firestore:rules
```

O junto con el hosting:

```bash
npm run deploy
```

## Desarrollo local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Desplegar hosting

```bash
npm run deploy
```

Solo la web:

```bash
npm run deploy:hosting
```

## Bot de correos (VPS, opcional)

Copia `server/reminders.js` al servidor y configura Brevo + service account de **este** proyecto Firebase.

```bash
npm install firebase-admin node-cron
node server/reminders.js --once
```

## Logo

El logo MEN está en `public/Logo.png` (mismo que el panel original).
