export function makeCatalogUseCases(catalogRepository) {
  return {
    getModuleCatalogs: (moduleKey) => catalogRepository.getModuleCatalogs(moduleKey),
    updateList: (moduleKey, listKey, items) =>
      catalogRepository.updateList(moduleKey, listKey, items),
  };
}
