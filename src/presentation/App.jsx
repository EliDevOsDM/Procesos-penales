import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import CrudPage from "./pages/CrudPage.jsx";
import RolesPage from "./pages/RolesPage.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import CatalogsPage from "./pages/CatalogsPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import Layout from "./components/Layout.jsx";
import { MODULE_VIEWS } from "./moduleViews.js";
import { MODULES } from "../domain/modules.js";

function PrivateRoute({ children, adminOnly = false }) {
  const { firebaseUser, isAdmin, loading } = useAuth();
  if (loading) {
    return <div className="fullscreen-loader">Cargando...</div>;
  }
  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function ModuleRoute({ module }) {
  const { can } = useAuth();
  if (!can(module.key)) {
    return <Navigate to="/" replace />;
  }
  return <CrudPage module={module} />;
}

function CalendarRoute() {
  const { can } = useAuth();
  if (!can(MODULES.PROCESOS_PENALES)) {
    return <Navigate to="/" replace />;
  }
  return <CalendarPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<HomePage />} />
            {MODULE_VIEWS.map((module) => (
              <Route
                key={module.key}
                path={module.path.slice(1)}
                element={<ModuleRoute module={module} />}
              />
            ))}
            <Route path="calendario" element={<CalendarRoute />} />
            <Route
              path="listas"
              element={
                <PrivateRoute adminOnly>
                  <CatalogsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="roles"
              element={
                <PrivateRoute adminOnly>
                  <RolesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="usuarios"
              element={
                <PrivateRoute adminOnly>
                  <UsersPage />
                </PrivateRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
