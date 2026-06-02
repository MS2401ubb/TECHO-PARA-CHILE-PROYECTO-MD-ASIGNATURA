const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Ciudad',
  tableName: 'ciudades',
  columns: {
    codigo: {
      primary: true,
      type: 'varchar',
      length: 50,
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