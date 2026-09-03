import { MODULE_LIST } from "../../domain/modules.js";

export function makeStatsUseCases(repositoriesByModule) {
  const canAccess = (role, moduleKey) =>
    Boolean(role?.isAdmin || role?.hasPermission(moduleKey));

  const statsByField = (items, field, emptyLabel = "Sin dato") => {
    const result = {};
    for (const item of items) {
      const value = item[field] || emptyLabel;
      if (!result[value]) {
        result[value] = { count: 0 };
      }
      result[value].count += 1;
    }
    return result;
  };

  return {
    getDashboard: async (role) => {
      const stats = {
        totalRegistros: 0,
        totalActivos: 0,
        totalTerminados: 0,
        modules: [],
      };

      for (const module of MODULE_LIST) {
        if (!canAccess(role, module.key)) continue;

        const items = await repositoriesByModule[module.key].getAll();
        const estadoField = module.estadoField || "estado_del_proceso";
        const etapaField = module.etapaField || "etapa_procesal_actual";
        const porEstado = statsByField(items, estadoField, "Sin estado");
        const porEtapa = statsByField(items, etapaField, "Sin etapa");

        const moduleStats = {
          key: module.key,
          label: module.navLabel || module.label,
          total: items.length,
          porEstado,
          porEtapa,
          estadoField,
          etapaField,
        };

        stats.modules.push(moduleStats);
        stats.totalRegistros += items.length;
        stats.totalActivos += porEstado.ACTIVO?.count ?? 0;
        stats.totalTerminados += porEstado.TERMINADO?.count ?? 0;
      }

      return stats;
    },
  };
}

import { formatCOP } from "../../domain/currency.js";

export { formatCOP };
