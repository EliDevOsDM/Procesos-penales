import { extractHearingEvents } from "../../domain/calendarEvents.js";
import { MODULES } from "../../domain/modules.js";

export function makeCalendarUseCases(repository) {
  const requireAccess = (role) => {
    if (!role?.hasPermission(MODULES.PROCESOS_PENALES)) {
      throw new Error("No tienes acceso al calendario de audiencias.");
    }
  };

  return {
    getHearings: async (role) => {
      requireAccess(role);
      const records = await repository.getAll();
      return extractHearingEvents(records);
    },
  };
}
