import { useEffect, useState } from "react";
import { userUseCases, roleUseCases } from "../../di/container.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function UsersPage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    const [userList, roleList] = await Promise.all([
      userUseCases.listUsers(),
      roleUseCases.listRoles(),
    ]);
    setUsers(userList);
    setRoles(roleList);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAssign = async (uid, roleId) => {
    setError("");
    try {
      await userUseCases.assignRole(uid, roleId || null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page">
      <h2>Usuarios</h2>
      <p className="page-subtitle">Asigna un rol a cada usuario registrado.</p>

      {error && <div className="alert">{error}</div>}

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.uid}>
                  <td data-label="Nombre">
                    {user.name || "—"}
                    {user.uid === profile?.uid && <span className="badge">Tú</span>}
                  </td>
                  <td data-label="Correo">{user.email}</td>
                  <td data-label="Rol">
                    <select
                      value={user.roleId || ""}
                      onChange={(e) => handleAssign(user.uid, e.target.value)}
                      disabled={user.uid === profile?.uid}
                    >
                      <option value="">Sin rol</option>
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
