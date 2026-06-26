import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'Cuadrilla',
  tableName: 'cuadrillas',
  columns: {
    codigo: {
      primary: true,
      type: 'int',
      generated: true,
    },
    descripcion: {
      type: 'text',
    },
  },
  relations: {
    voluntariosParticipando: {
      target: 'VoluntarioParticipaEnCuadrilla',
      type: 'one-to-many',
      inverseSide: 'cuadrilla'
    }
  }
});