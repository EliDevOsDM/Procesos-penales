import { useEffect, useState } from "react";
import { roleUseCases } from "../../di/container.js";
import {
  ALL_PERMISSIONS,
  PERMISSION_LABELS,
} from "../../domain/permissions.js";

const emptyForm = {
  id: null,
  name: "",
  description: "",
  permissions: [],
  readOnlyPermissions: [],
};

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadRoles = async () => {
    setRoles(await roleUseCases.listRoles());
    setLoading(false);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const togglePermission = (permission) => {
    setForm((prev) => {
      const has = prev.permissions.includes(permission);
      return {
        ...prev,
        permissions: has
          ? prev.permissions.filter((p) => p !== permission)
          : [...prev.permissions, permission],
        readOnlyPermissions: has
          ? prev.readOnlyPermissions.filter((p) => p !== permission)
          : prev.readOnlyPermissions,
      };
    });
  };

  const toggleReadOnly = (permission) => {
    setForm((prev) => ({
      ...prev,
      readOnlyPermissions: prev.readOnlyPermissions.includes(permission)
        ? prev.readOnlyPermissions.filter((p) => p !== permission)
        : [...prev.readOnlyPermissions, permission],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (form.id) {
        const role = roles.find((r) => r.id === form.id);
        role.name = form.name;
        role.description = form.description;
        role.permissions = form.permissions;
        role.readOnlyPermissions = form.readOnlyPermissions;
        await roleUseCases.updateRole(role);
      } else {
        await roleUseCases.createRole(form);
      }
      setForm(emptyForm);
      await loadRoles();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleEdit = (role) => {
    setForm({
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: [...role.permissions],
      readOnlyPermissions: [...(role.readOnlyPermissions ?? [])],
    });
  };

  const handleDelete = async (role) => {
    if (!window.confirm(`¿Eliminar el rol "${role.name}"?`)) return;
    setError("");
    try {
      await roleUseCases.deleteRole(role);
      await loadRoles();
    } catch (err) {
      setError(err.message);
    }
  };

  const permissionLabel = (permission, readOnly) => {
    const base = PERMISSION_LABELS[permission];
    return readOnly ? `${base} (solo lectura)` : base;
  };

  return (
    <div className="page">
      <h2>Gestión de roles</h2>
      <p className="page-subtitle">
        Crea roles y define si pueden ver y editar, o solo consultar.
      </p>

      {error && <div className="alert">{error}</div>}

      <form className="card form-card" onSubmit={handleSubmit}>
        <h3>{form.id ? "Editar rol" : "Nuevo rol"}</h3>
        <div className="form-row">
          <label>
            Nombre
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ej. Consultor jurídico"
              required
            />
          </label>
          <label>
            Descripción
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Opcional"
            />
          </label>
        </div>

        <fieldset className="permissions-fieldset">
          <legend>Acceso a los módulos</legend>
          <div className="permissions-module-list">
            {ALL_PERMISSIONS.map((permission) => (
              <div key={permission} className="permission-module-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={form.permissions.includes(permission)}
                    onChange={() => togglePermission(permission)}
                  />
                  {PERMISSION_LABELS[permission]}
                </label>
                {form.permissions.includes(permission) && (
                  <label className="checkbox-label permission-readonly">
                    <input
                      type="checkbox"
                      checked={form.readOnlyPermissions.includes(permission)}
                      onChange={() => toggleReadOnly(permission)}
                    />
                    Solo lectura (ver, no modificar)
                  </label>
                )}
              </div>
            ))}
          </div>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn primary" disabled={busy}>
            {busy ? "Guardando..." : form.id ? "Guardar cambios" : "Crear rol"}
          </button>
          {form.id && (
            <button
              type="button"
              className="btn"
              onClick={() => setForm(emptyForm)}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Cargando roles...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Rol</th>
                <th>Descripción</th>
                <th>Permisos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.id}>
                  <td data-label="Rol">
                    {role.name} {role.isAdmin && <span className="badge admin">Admin</span>}
                  </td>
                  <td data-label="Descripción">{role.description || "—"}</td>
                  <td data-label="Permisos">
                    {role.isAdmin ? (
                      <span className="badge">Todos</span>
                    ) : role.permissions.length ? (
                      role.permissions.map((p) => (
                        <span key={p} className="badge">
                          {permissionLabel(p, role.readOnlyPermissions?.includes(p))}
                        </span>
                      ))
                    ) : (
                      "Sin permisos"
                    )}
                  </td>
                  <td data-label="Acciones">
                    {!role.isAdmin && (
                      <div className="row-actions">
                        <button className="btn small" onClick={() => handleEdit(role)}>
                          Editar
                        </button>
                        <button
                          className="btn small danger"
                          onClick={() => handleDelete(role)}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr>
                  <td colSpan={4}>Aún no hay roles creados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
