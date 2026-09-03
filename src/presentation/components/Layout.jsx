import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { MODULES } from "../../domain/modules.js";

export default function Layout() {
  const { profile, role, isAdmin, can, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="layout">
      <header className="topbar">
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Abrir menú"
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="brand">Procesos Penales</h1>
        <div className="topbar-user">
          <span className="user-name">{profile?.name || profile?.email}</span>
          <span className="user-role">{role ? role.name : "Sin rol"}</span>
        </div>
      </header>

      <div className="layout-body">
        <nav className={`sidebar ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Inicio
          </NavLink>
          {isAdmin && (
            <NavLink to="/usuarios" onClick={closeMenu}>
              Usuarios
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/roles" onClick={closeMenu}>
              Roles
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/listas" onClick={closeMenu}>
              Configuración
            </NavLink>
          )}
          {can(MODULES.PROCESOS_PENALES) && (
            <NavLink to="/procesos-penales" onClick={closeMenu}>
              Procesos Penales
            </NavLink>
          )}
          {can(MODULES.PROCESOS_PENALES) && (
            <NavLink to="/calendario" onClick={closeMenu}>
              Calendario
            </NavLink>
          )}
          <button className="logout-btn" onClick={logout}>
            Cerrar sesión
          </button>
        </nav>
        {menuOpen && <div className="sidebar-backdrop" onClick={closeMenu} />}

        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
