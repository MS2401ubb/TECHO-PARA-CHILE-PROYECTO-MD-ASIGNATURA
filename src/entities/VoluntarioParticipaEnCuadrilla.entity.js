const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'VoluntarioParticipaEnCuadrilla',
  tableName: 'voluntario_participa_en_cuadrilla',
  columns: {
    rutVoluntario: {
      primary: true,
      type: 'varchar',
      length: 20,
    },
    codigoCuadrilla: {
      primary: true,
      type: 'varchar',
      length: 50,
    },
    fechaInicio: {
      primary: true,
      type: 'date',
    },
    fechaFin: {
      type: 'date',
      nullable: true, // Permanece NULL mientras el voluntario siga activo en esa cuadrilla
    },
  },
  relations: {
    voluntario: {
      target: 'Voluntario',
      type: 'many-to-one',
      joinColumn: { name: 'rutVoluntario' },
      onDelete: 'CASCADE',
    },
    cuadrilla: {
      target: 'Cuadrilla',
      type: 'many-to-one',
      joinColumn: { name: 'codigoCuadrilla' },
      onDelete: 'CASCADE',
    },
  },
});