/**
 * Contrato genérico para los módulos CRUD.
 * @interface
 */
export class ICrudRepository {
  async getAll() { throw new Error("No implementado"); }
  async create(_data) { throw new Error("No implementado"); }
  async update(_id, _data) { throw new Error("No implementado"); }
  async remove(_id) { throw new Error("No implementado"); }
}
