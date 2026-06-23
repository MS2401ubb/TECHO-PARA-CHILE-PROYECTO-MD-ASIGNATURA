import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'JefeCuadrilla',
  tableName: 'jefes_cuadrillas',
  columns: {
    rutUsuario: {
      primary: true,
      type: 'varchar',
      length: 20,
    },
  },
  relations: {
    usuario: {
      target: 'Usuario',
      type: 'one-to-one',
      joinColumn: { name: 'rutUsuario' },
      onDelete: 'CASCADE',
    },
  },
});