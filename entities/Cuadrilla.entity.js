const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Cuadrilla',
  tableName: 'cuadrillas',
  columns: {
    codigo: {
      primary: true,
      type: 'varchar',
      length: 50,
    },
    descripcion: {
      type: 'text',
    },
  },
});