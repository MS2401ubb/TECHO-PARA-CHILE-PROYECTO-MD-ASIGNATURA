import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'EncargadoCentral',
  tableName: 'encargados_central',
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