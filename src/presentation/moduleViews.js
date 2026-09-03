import { MODULES, MODULE_LIST, getModule } from "../domain/modules.js";

const VIEW_INFO = {
  [MODULES.PROCESOS_PENALES]: { path: "/procesos-penales" },
};

export const MODULE_VIEWS = MODULE_LIST.map((module) => ({
  ...module,
  ...VIEW_INFO[module.key],
}));

export const getModuleView = (key) => ({ ...getModule(key), ...VIEW_INFO[key] });
