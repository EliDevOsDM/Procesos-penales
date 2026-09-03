import { ALL_PERMISSIONS } from "../permissions.js";

export class Role {
  constructor({
    id = null,
    name,
    description = "",
    permissions = [],
    readOnlyPermissions = [],
    isAdmin = false,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.permissions = permissions.filter((p) => ALL_PERMISSIONS.includes(p));
    this.readOnlyPermissions = readOnlyPermissions.filter((p) =>
      ALL_PERMISSIONS.includes(p)
    );
    this.isAdmin = isAdmin;
  }

  hasPermission(permission) {
    return this.isAdmin || this.permissions.includes(permission);
  }

  hasWritePermission(permission) {
    if (this.isAdmin) return true;
    return (
      this.permissions.includes(permission) &&
      !this.readOnlyPermissions.includes(permission)
    );
  }

  static validate({ name }) {
    if (!name || !name.trim()) {
      throw new Error("El nombre del rol es obligatorio.");
    }
  }
}
