const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Vivienda',
  tableName: 'viviendas',
  columns: {
    codigo: {
      primary: true,
      type: 'varchar',
      length: 50,
    },
    direccion: {
      type: 'text',
    },
    tipoObra: {
      type: 'varchar',
      length: 100,
    },
    estado: {
      type: 'varchar',
      length: 50,
    },
    porcentajeAvance: {
      type: 'int',
      default: 0,
    },
    fechaInicioEstimada: {
      type: 'date',
    },
    fechaFinEstimada: {
      type: 'date',
    },
    fechaFinReal: {
      type: 'date',
      nullable: true,
    },
    montajeEstructural: {
      type: 'boolean',
    },
    habilidadTecnica: {
      type: 'boolean',
    },
    conexionesBasicas: {
      type: 'boolean',
    },
    observacionesValidacion: {
      type: 'text',
      nullable: true,
    },
  },
  relations: {
    ciudad: {
      target: 'Ciudad',
      type: 'many-to-one',
      joinColumn: { name: 'codigoCiudad' },
      onDelete: 'RESTRICT', 
    },
  },
});