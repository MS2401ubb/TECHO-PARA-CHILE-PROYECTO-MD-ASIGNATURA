const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Region',
  tableName: 'regiones',
  columns: {
    codigo: {
      primary: true,
      type: 'varchar',
      length: 10,
    },
    nombre: {
      type: 'varchar',
      length: 100,
    },
  },
});