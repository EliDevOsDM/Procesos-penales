import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { MODULE_VIEWS } from "../moduleViews.js";
import { statsUseCases } from "../../di/container.js";
import KpiBarChart, { KPI_CHART_COLORS } from "../components/KpiBarChart.jsx";

const sortBreakdownEntries = (entries) =>
  [...entries].sort(([, a], [, b]) => b.count - a.count);

const toChartData = (entries) =>
  entries.map(([name, data]) => ({ name, value: data.count }));

function BreakdownList({ title, entries, total }) {
  return (
    <div className="kpi-breakdown-panel">
      <h4 className="kpi-breakdown-title">{title}</h4>
      <ul className="estado-breakdown-list">
        {entries.map(([label, data], index) => {
          const pct = total > 0 ? ((data.count / total) * 100).toFixed(1) : "0";
          const color = KPI_CHART_COLORS[index % KPI_CHART_COLORS.length];

          return (
            <li key={label} className="estado-breakdown-item">
              <div className="estado-breakdown-row">
                <span className="estado-dot" style={{ background: color }} />
                <span className="estado-name">{label}</span>
                <span className="estado-count">{data.count}</span>
                <span className="estado-pct">{pct}%</span>
              </div>
              <div className="estado-bar-track">
                <div
                  className="estado-bar-fill"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function HomePage() {
  const { profile, role, can, isAdmin, profileError } = useAuth();
  const accessible = MODULE_VIEWS.filter((m) => can(m.key));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsUseCases
      .getDashboard(role)
      .then(setStats)
      .finally(() => setLoading(false));
  }, [role]);

  return (
    <div className="page">
      <h2>Hola, {profile?.name || profile?.email}</h2>
      <p className="page-subtitle">
        Tu rol: <strong>{role ? role.name : "Sin rol asignado"}</strong>
        {isAdmin && " (acceso total)"}
      </p>

      {profileError && (
        <div className="alert">{profileError}</div>
      )}

      {loading ? (
        <p>Cargando estadísticas...</p>
      ) : (
        stats && (
          <>
            <div className="kpi-grid">
              <div className="card kpi-card">
                <span className="kpi-label">Total registros</span>
                <span className="kpi-value">{stats.totalRegistros}</span>
              </div>
              <div className="card kpi-card">
                <span className="kpi-label">Activos</span>
                <span className="kpi-value">{stats.totalActivos}</span>
              </div>
              <div className="card kpi-card">
                <span className="kpi-label">Terminados</span>
                <span className="kpi-value">{stats.totalTerminados}</span>
              </div>
            </div>
          </>
        )
      )}

      {stats?.modules?.length > 0 && (
        <div className="kpi-detail-grid">
          {stats.modules.map((m) => {
            const estadoEntries = sortBreakdownEntries(Object.entries(m.porEstado));
            const etapaEntries = sortBreakdownEntries(Object.entries(m.porEtapa || {}));
            const etapaChartData = toChartData(etapaEntries);

            return (
              <div key={m.key} className="card kpi-module-card">
                <div className="kpi-module-header">
                  <h3>{m.label}</h3>
                  <span className="kpi-module-total">{m.total} registros</span>
                </div>

                {(estadoEntries.length > 0 || etapaEntries.length > 0) && (
                  <div className="kpi-module-body">
                    {estadoEntries.length > 0 && (
                      <BreakdownList
                        title="Estado del proceso"
                        entries={estadoEntries}
                        total={m.total}
                      />
                    )}

                    <div className="kpi-module-chart">
                      <KpiBarChart
                        embedded
                        title="Etapa procesal actual"
                        data={etapaChartData}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {accessible.length > 0 ? (
        <div className="module-grid">
          {accessible.map((m) => (
            <Link key={m.key} to={m.path} className="card module-card">
              <h3>{m.navLabel || m.label}</h3>
              <span className="badge">{m.crudName}</span>
            </Link>
          ))}
        </div>
      ) : !role && profile ? (
        <div className="card">
          <p>
            Tu cuenta existe pero <strong>no tiene rol asignado</strong>.
          </p>
          <p>
            Cierra sesión y vuelve a entrar. Si persiste, en Firebase Console
            revisa la colección <strong>users</strong> y asigna el rol
            Administrador, o borra usuarios viejos y regístrate de nuevo.
          </p>
        </div>
      ) : (
        <div className="card">
          <p>
            Todavía no tienes acceso a ningún módulo. Pídele al administrador
            que te asigne un rol.
          </p>
        </div>
      )}
    </div>
  );
}
