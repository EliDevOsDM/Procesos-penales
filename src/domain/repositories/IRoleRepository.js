/**
 * Contrato del repositorio de roles (la capa de dominio no conoce Firebase).
 * @interface
 */
export class IRoleRepository {
  async getAll() { throw new Error("No implementado"); }
  async getById(_id) { throw new Error("No implementado"); }
  async create(_role) { throw new Error("No implementado"); }
  async update(_role) { throw new Error("No implementado"); }
  async remove(_id) { throw new Error("No implementado"); }
}
