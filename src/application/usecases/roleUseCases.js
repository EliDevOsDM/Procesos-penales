import { Role } from "../../domain/entities/Role.js";

export function makeRoleUseCases(roleRepository) {
  return {
    listRoles: () => roleRepository.getAll(),

    createRole: async ({ name, description, permissions, readOnlyPermissions }) => {
      Role.validate({ name });
      const role = new Role({
        name: name.trim(),
        description,
        permissions,
        readOnlyPermissions,
      });
      return roleRepository.create(role);
    },

    updateRole: async (role) => {
      Role.validate({ name: role.name });
      if (role.isAdmin) {
        throw new Error("El rol de administrador no se puede modificar.");
      }
      return roleRepository.update(role);
    },

    deleteRole: async (role) => {
      if (role.isAdmin) {
        throw new Error("El rol de administrador no se puede eliminar.");
      }
      return roleRepository.remove(role.id);
    },
  };
}
