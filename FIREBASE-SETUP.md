# Firebase — Procesos Penales

Copia este archivo como referencia. Los valores reales van en `src/infrastructure/firebase/config.js`.

## 1. Crear proyecto Firebase

1. https://console.firebase.google.com/ → **Crear proyecto**
2. Nombre sugerido: `procesos-penales` (o el que prefieras)
3. Activa **Google Analytics** (opcional)

## 2. Activar servicios

| Servicio | Dónde |
|----------|--------|
| **Authentication** | Sign-in method → Email/Password → Habilitar |
| **Firestore** | Crear base de datos → modo producción → ubicación |
| **Storage** | Empezar (para PDFs de referencia) |

## 3. App web + config SDK

1. Configuración del proyecto → **Tus apps** → icono Web `</>`
2. Copia los valores a `src/infrastructure/firebase/config.js`

## 4. Reglas Firestore

El archivo `firestore.rules` ya está listo. Despliégalo cuando quieras:

```bash
cd Panel-procesos-penales
firebase login
# Edita .firebaserc → "default": "tu-project-id"
firebase deploy --only firestore:rules
```

## 5. Reglas Storage (recomendado)

En Firebase Console → Storage → Reglas, usa algo como:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 6. Hosting

```bash
npm install
npm run deploy
```

## 7. Bot de correos (VPS, opcional)

1. Firebase → Cuentas de servicio → **Generar nueva clave privada** (JSON)
2. Pega los datos en `server/reminders.js` → `SERVICE_ACCOUNT`
3. Configura Brevo en `CONFIG`

## 8. Primer usuario admin

Regístrate en la app. El **primer usuario** queda como administrador automáticamente.
