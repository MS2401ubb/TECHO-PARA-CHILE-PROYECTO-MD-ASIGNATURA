import { EntitySchema } from 'typeorm';

export default new EntitySchema({
  name: 'JornadaValidacion',
  tableName: 'jornada_validaciones',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    montajeEstructural: {
      type: 'boolean',
      default: false,
    },
    habilidadTecnica: {
      type: 'boolean',
      default: false,
    },
    conexionesBasicas: {
      type: 'boolean',
      default: false,
    },
    observaciones: {
      type: 'text',
      nullable: true,
    },
    fechaValidacion: {
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
    },
    id_jornada: {
      type: 'int',
      nullable: false,
    },
  },
  relations: {
    jornada: {
      target: 'Jornada',
      type: 'one-to-one',
      joinColumn: { name: 'id_jornada' },
      onDelete: 'CASCADE',
    },
  },
});
