import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'EncargadoVoluntarios',
  tableName: 'encargados_voluntarios',
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