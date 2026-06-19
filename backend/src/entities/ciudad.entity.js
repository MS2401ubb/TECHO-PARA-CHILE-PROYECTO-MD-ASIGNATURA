import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'Ciudad',
  tableName: 'ciudades',
  columns: {
    codigo: {
      primary: true,
      type: 'int',
      generated: true,
    },
    nombre: {
      type: 'varchar',
      length: 100,
    },
  },
  relations: {
    region: {
      target: 'Region',
      type: 'many-to-one',
      joinColumn: { name: 'codigoRegion' },
      onDelete: 'CASCADE',
    },
  },
});