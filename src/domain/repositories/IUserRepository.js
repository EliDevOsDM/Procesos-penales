/**
 * Contrato del repositorio de usuarios.
 * @interface
 */
export class IUserRepository {
  async getAll() { throw new Error("No implementado"); }
  async getByUid(_uid) { throw new Error("No implementado"); }
  async save(_userProfile) { throw new Error("No implementado"); }
  async assignRole(_uid, _roleId) { throw new Error("No implementado"); }
}
