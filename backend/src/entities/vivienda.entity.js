import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'Vivienda',
  tableName: 'viviendas',
  columns: {
    codigo: { // EJEMPLO: "CONCE-001", "VALPA-002", etc. ({PRIMERAS 5 LETRAS DE LA CIUDAD}-{NÚMERO SECUENCIAL})
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
    cuadrillasTrabajando: {
      target: 'CuadrillaTrabajaEnVivienda',
      type: 'one-to-many',
      inverseSide: 'vivienda'
    }
  },
});