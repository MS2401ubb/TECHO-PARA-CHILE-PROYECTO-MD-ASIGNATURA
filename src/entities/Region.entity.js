const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Region',
  tableName: 'regiones',
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
});